import { Injectable, Logger } from '@nestjs/common';
import { RouterDbService } from './router-db.service';
import { randomUUID } from 'crypto';

interface InMemoryQuotaUsage {
  usedTokens: number;
  reservedTokens: number;
  usedRequests: number;
  reservedRequests: number;
  windowEnd: number;
}

@Injectable()
export class RouterReservationService {
  private readonly logger = new Logger(RouterReservationService.name);
  private memoryUsage = new Map<string, InMemoryQuotaUsage>();

  constructor(private db: RouterDbService) {}

  private getUsage(key: string): InMemoryQuotaUsage {
    const now = Date.now();
    let record = this.memoryUsage.get(key);
    if (!record || record.windowEnd <= now) {
      record = {
        usedTokens: 0,
        reservedTokens: 0,
        usedRequests: 0,
        reservedRequests: 0,
        windowEnd: now + 60 * 1000, // 1 minute rolling window
      };
      this.memoryUsage.set(key, record);
    }
    return record;
  }

  async reserve(
    requestUuid: string,
    modelKey: string,
    estimatedTokens: number,
    limitTokens: number = 500000,
    limitRequests: number = 30,
  ): Promise<string | null> {
    if (this.db.hasPostgres()) {
      try {
        const client = await this.db.getPool()!.connect();
        try {
          await client.query('BEGIN');
          const res = await client.query(
            `
            WITH eligible_quotas AS (
                SELECT
                    qu.id AS usage_id,
                    qd.id AS definition_id,
                    CASE
                        WHEN qd.quota_type = 'TOKENS' THEN $2
                        ELSE 1
                    END AS amount
                FROM quota_definitions qd
                JOIN quota_usage qu ON qu.quota_definition_id = qd.id
                WHERE qd.model_id = $1::uuid
                  AND qd.active = true
                  AND qu.window_end > NOW()
                  AND (
                      (qd.quota_type = 'TOKENS' AND (qu.used + qu.reserved + $2) <= qd.limit_value)
                      OR
                      (qd.quota_type = 'REQUESTS' AND (qu.used + qu.reserved + 1) <= qd.limit_value)
                  )
                FOR UPDATE OF qu SKIP LOCKED
            ),
            expected_count AS (
                SELECT COUNT(*) as cnt FROM quota_definitions WHERE model_id = $1::uuid AND active = true
            ),
            matched_count AS (
                SELECT COUNT(*) as cnt FROM eligible_quotas
            ),
            reservations_to_make AS (
                SELECT eq.usage_id, eq.definition_id, eq.amount
                FROM eligible_quotas eq
                WHERE (SELECT cnt FROM expected_count) = (SELECT cnt FROM matched_count)
            )
            UPDATE quota_usage qu
            SET reserved = qu.reserved + rtm.amount
            FROM reservations_to_make rtm
            WHERE qu.id = rtm.usage_id
            RETURNING rtm.definition_id, rtm.amount;
          `,
            [modelKey, estimatedTokens],
          );

          const checkQuotas = await client.query(
            'SELECT EXISTS (SELECT 1 FROM quota_definitions WHERE model_id = $1::uuid AND active = true)',
            [modelKey],
          );
          const hasQuotas = checkQuotas.rows[0].exists;

          if (hasQuotas && res.rows.length === 0) {
            await client.query('COMMIT');
            return null; // SKIP LOCKED or exhausted
          }

          for (const row of res.rows) {
            await client.query(
              `
              INSERT INTO reservations (
                id, request_uuid, model_id, quota_definition_id, reserved_amount, state, expires_at
              ) VALUES ($1, $2, $3, $4, $5, 'pending', NOW() + INTERVAL '60 seconds')
            `,
              [randomUUID(), requestUuid, modelKey, row.definition_id, row.amount],
            );
          }

          await client.query('COMMIT');
          return requestUuid;
        } catch (err: any) {
          await client.query('ROLLBACK');
          this.logger.error(`PostgreSQL reservation error: ${err.message}`);
        } finally {
          client.release();
        }
      } catch (err: any) {
        this.logger.debug(`Falling back to memory quota: ${err.message}`);
      }
    }

    // In-memory atomic headroom verification
    const usage = this.getUsage(modelKey);
    if (
      usage.usedTokens + usage.reservedTokens + estimatedTokens > limitTokens ||
      usage.usedRequests + usage.reservedRequests + 1 > limitRequests
    ) {
      return null;
    }

    usage.reservedTokens += estimatedTokens;
    usage.reservedRequests += 1;
    return requestUuid;
  }

  async confirm(requestUuid: string, modelKey: string, actualTokens: number, estimatedTokens: number): Promise<void> {
    if (this.db.hasPostgres()) {
      try {
        await this.db.getPool()!.query(
          `
          WITH res AS (
              UPDATE reservations
              SET state = 'completed'
              WHERE request_uuid = $1::uuid AND state = 'pending'
              RETURNING model_id, quota_definition_id, reserved_amount
          )
          UPDATE quota_usage qu
          SET
              used     = qu.used + CASE WHEN qd.quota_type = 'TOKENS' THEN $2 ELSE 1 END,
              reserved = GREATEST(0, qu.reserved - res.reserved_amount)
          FROM res
          JOIN quota_definitions qd ON qd.id = res.quota_definition_id
          WHERE qu.quota_definition_id = res.quota_definition_id
            AND qu.window_end > NOW();
        `,
          [requestUuid, actualTokens],
        );
      } catch (err: any) {
        this.logger.debug(`Postgres confirm skipped: ${err.message}`);
      }
    }

    const usage = this.getUsage(modelKey);
    usage.reservedTokens = Math.max(0, usage.reservedTokens - estimatedTokens);
    usage.reservedRequests = Math.max(0, usage.reservedRequests - 1);
    usage.usedTokens += actualTokens;
    usage.usedRequests += 1;
  }

  async release(requestUuid: string, modelKey: string, estimatedTokens: number): Promise<void> {
    if (this.db.hasPostgres()) {
      try {
        await this.db.getPool()!.query(
          `
          WITH res AS (
              UPDATE reservations
              SET state = 'released'
              WHERE request_uuid = $1::uuid AND state = 'pending'
              RETURNING quota_definition_id, reserved_amount
          )
          UPDATE quota_usage qu
          SET reserved = GREATEST(0, qu.reserved - res.reserved_amount)
          FROM res
          WHERE qu.quota_definition_id = res.quota_definition_id
            AND qu.window_end > NOW();
        `,
          [requestUuid],
        );
      } catch (err: any) {
        this.logger.debug(`Postgres release skipped: ${err.message}`);
      }
    }

    const usage = this.getUsage(modelKey);
    usage.reservedTokens = Math.max(0, usage.reservedTokens - estimatedTokens);
    usage.reservedRequests = Math.max(0, usage.reservedRequests - 1);
  }
}
