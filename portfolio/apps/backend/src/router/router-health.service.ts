import { Injectable, Logger } from '@nestjs/common';
import { RouterDbService } from './router-db.service';

const FAILURE_THRESHOLD = 3;
const BACKOFF_SECONDS = [30, 120, 300, 900]; // 30s, 2m, 5m, 15m
const EMA_ALPHA = 0.2;

interface InMemoryHealth {
  healthy: boolean;
  consecutiveFailures: number;
  disabledUntil: Date | null;
  averageLatency: number | null;
  errorRate: number;
  lastSuccess: Date | null;
  lastFailure: Date | null;
}

@Injectable()
export class RouterHealthService {
  private readonly logger = new Logger(RouterHealthService.name);
  private memoryHealth = new Map<string, InMemoryHealth>();

  constructor(private db: RouterDbService) {}

  private getMem(modelKey: string): InMemoryHealth {
    if (!this.memoryHealth.has(modelKey)) {
      this.memoryHealth.set(modelKey, {
        healthy: true,
        consecutiveFailures: 0,
        disabledUntil: null,
        averageLatency: null,
        errorRate: 0.0,
        lastSuccess: null,
        lastFailure: null,
      });
    }
    return this.memoryHealth.get(modelKey)!;
  }

  isModelHealthy(modelKey: string): boolean {
    const mem = this.getMem(modelKey);
    if (!mem.healthy) {
      if (mem.disabledUntil && mem.disabledUntil <= new Date()) {
        // Cooldown passed, half-open test
        mem.healthy = true;
        mem.disabledUntil = null;
        return true;
      }
      return false;
    }
    return true;
  }

  async updateSuccess(modelKey: string, latencyMs: number): Promise<void> {
    // In-memory update
    const mem = this.getMem(modelKey);
    mem.healthy = true;
    mem.consecutiveFailures = 0;
    mem.disabledUntil = null;
    mem.lastSuccess = new Date();
    mem.errorRate = Math.max(0, mem.errorRate * 0.95);
    mem.averageLatency =
      mem.averageLatency === null
        ? latencyMs
        : mem.averageLatency * (1 - EMA_ALPHA) + latencyMs * EMA_ALPHA;

    // PostgreSQL update if available
    if (this.db.hasPostgres()) {
      try {
        await this.db.getPool()!.query(
          `
          UPDATE model_health
          SET
              healthy              = true,
              consecutive_failures = 0,
              disabled_until       = NULL,
              last_success         = NOW(),
              average_latency      = CASE
                                         WHEN average_latency IS NULL THEN $2::float8
                                         ELSE average_latency * (1.0 - $3::float8) + $2::float8 * $3::float8
                                     END,
              error_rate           = GREATEST(0.0, error_rate * 0.95),
              updated_at           = NOW()
          WHERE model_id = $1::uuid;
        `,
          [modelKey, latencyMs, EMA_ALPHA],
        );
      } catch (err: any) {
        this.logger.debug(`Postgres health update skipped: ${err.message}`);
      }
    }
  }

  async updateFailure(modelKey: string): Promise<void> {
    // In-memory update
    const mem = this.getMem(modelKey);
    mem.lastFailure = new Date();
    mem.consecutiveFailures += 1;
    mem.errorRate = Math.min(1.0, mem.errorRate * 0.95 + 0.05);

    if (mem.consecutiveFailures >= FAILURE_THRESHOLD) {
      mem.healthy = false;
      const idx = Math.min(
        Math.max(0, mem.consecutiveFailures - FAILURE_THRESHOLD),
        BACKOFF_SECONDS.length - 1,
      );
      const backoffSec = BACKOFF_SECONDS[idx];
      mem.disabledUntil = new Date(Date.now() + backoffSec * 1000);
      this.logger.warn(
        `CIRCUIT BREAKER OPEN: ${modelKey} disabled for ${backoffSec}s (${mem.consecutiveFailures} consecutive failures)`,
      );
    }

    // PostgreSQL update if available
    if (this.db.hasPostgres()) {
      try {
        const pool = this.db.getPool()!;
        const res = await pool.query(
          'SELECT consecutive_failures FROM model_health WHERE model_id = $1::uuid',
          [modelKey],
        );
        const current = res.rows.length > 0 ? res.rows[0].consecutive_failures : 0;
        const idx = Math.min(
          Math.max(0, current + 1 - FAILURE_THRESHOLD),
          BACKOFF_SECONDS.length - 1,
        );
        const backoff = BACKOFF_SECONDS[idx];

        await pool.query(
          `
          UPDATE model_health
          SET
              last_failure         = NOW(),
              consecutive_failures = consecutive_failures + 1,
              error_rate           = LEAST(1.0, error_rate * 0.95 + 0.05),
              healthy              = CASE
                                         WHEN consecutive_failures + 1 >= $2 THEN false
                                         ELSE healthy
                                     END,
              disabled_until       = CASE
                                         WHEN consecutive_failures + 1 >= $2
                                         THEN NOW() + ($3 * INTERVAL '1 second')
                                         ELSE disabled_until
                                     END,
              updated_at           = NOW()
          WHERE model_id = $1::uuid;
        `,
          [modelKey, FAILURE_THRESHOLD, backoff],
        );
      } catch (err: any) {
        this.logger.debug(`Postgres failure update skipped: ${err.message}`);
      }
    }
  }
}
