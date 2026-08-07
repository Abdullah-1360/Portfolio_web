import { Injectable, Logger } from '@nestjs/common';
import { RouterDbService } from './router-db.service';
import { RouterHealthService } from './router-health.service';
import { PROVIDERS_CONFIG, ProviderConfig, ModelConfig } from './providers.config';

export interface ModelCandidate {
  modelId: string;
  modelName: string;
  providerId: string;
  providerName: string;
  baseUrl: string;
  tier: string;
  averageLatency: number | null;
  overallScore: number;
}

const TIER_ORDER: Array<'PRIMARY_FREE' | 'SECONDARY_FREE' | 'LIMITED_FREE' | 'PAID' | 'LOCAL'> = [
  'PRIMARY_FREE',
  'SECONDARY_FREE',
  'LIMITED_FREE',
  'PAID',
  'LOCAL',
];

const SELECT_SQL = `
SELECT
    m.id              AS "modelId",
    m.model_name      AS "modelName",
    m.provider_id     AS "providerId",
    p.name            AS "providerName",
    p.base_url        AS "baseUrl",
    mh.average_latency AS "averageLatency",
    rs.overall_score  AS "overallScore",
    m.tier
FROM models m
JOIN providers p             ON p.id = m.provider_id
JOIN model_health mh         ON mh.model_id = m.id
JOIN routing_scores rs       ON rs.model_id = m.id
JOIN model_availability ma   ON ma.model_id = m.id
JOIN model_lifecycle ml      ON ml.model_id = m.id
WHERE
    m.enabled = true
    AND p.enabled = true
    AND mh.healthy = true
    AND (mh.disabled_until IS NULL OR mh.disabled_until < NOW())
    AND ma.available = true
    AND (ma.expires_at IS NULL OR ma.expires_at > NOW())
    AND (ml.expires_at IS NULL OR ml.expires_at > NOW())
    AND (ml.deprecated_at IS NULL OR ml.deprecated_at::timestamptz > NOW())
    AND m.id != ALL($1::uuid[])
    AND m.tier = $2::tier_enum
    AND (
        $4::text[] IS NULL 
        OR (
            SELECT COUNT(DISTINCT mt.tag) 
            FROM model_tags mt 
            WHERE mt.model_id = m.id AND mt.tag = ANY($4::text[])
        ) = array_length($4::text[], 1)
    )
    AND (
        NOT EXISTS (
            SELECT 1 FROM quota_definitions qd2
            WHERE qd2.model_id = m.id AND qd2.active = true
        )
        OR NOT EXISTS (
            SELECT 1
            FROM quota_definitions qd
            JOIN quota_usage qu ON qu.quota_definition_id = qd.id
            WHERE qd.model_id = m.id
              AND qd.active = true
              AND qu.window_end > NOW()
              AND (
                  (qd.quota_type = 'TOKENS' AND (qu.used + qu.reserved + $3) > qd.limit_value)
                  OR
                  (qd.quota_type = 'REQUESTS' AND (qu.used + qu.reserved + 1) > qd.limit_value)
              )
        )
    )
ORDER BY
    mh.average_latency   ASC  NULLS LAST,
    rs.overall_score     DESC,
    m.last_selected_at   ASC  NULLS FIRST
LIMIT 1
FOR UPDATE OF m SKIP LOCKED;
`;

@Injectable()
export class RouterSelectorService {
  private readonly logger = new Logger(RouterSelectorService.name);
  private roundRobinIndexes = new Map<string, number>();

  constructor(
    private db: RouterDbService,
    private health: RouterHealthService,
  ) {}

  async selectModelWaterfall(
    estimatedTokens: number,
    excludedModelIds: string[] = [],
    requiredTags: string[] | null = null,
  ): Promise<ModelCandidate | null> {
    // 1. If PostgreSQL is active, use atomic SKIP LOCKED SQL
    if (this.db.hasPostgres()) {
      const pool = this.db.getPool()!;
      for (const tier of TIER_ORDER) {
        try {
          const client = await pool.connect();
          try {
            await client.query('BEGIN');
            const res = await client.query(SELECT_SQL, [
              excludedModelIds,
              tier,
              estimatedTokens,
              requiredTags && requiredTags.length > 0 ? requiredTags : null,
            ]);

            if (res.rows.length > 0) {
              const row = res.rows[0];
              await client.query('UPDATE models SET last_selected_at = NOW() WHERE id = $1', [row.modelId]);
              await client.query('COMMIT');

              return {
                modelId: row.modelId,
                modelName: row.modelName,
                providerId: row.providerId,
                providerName: row.providerName,
                baseUrl: row.baseUrl,
                averageLatency: row.averageLatency ? parseFloat(row.averageLatency) : null,
                overallScore: parseFloat(row.overallScore),
                tier: row.tier,
              };
            }
            await client.query('COMMIT');
          } catch (err: any) {
            await client.query('ROLLBACK');
            this.logger.error(`Postgres selector query failed: ${err.message}`);
          } finally {
            client.release();
          }
        } catch (err: any) {
          this.logger.debug(`Pool connect failed: ${err.message}`);
        }
      }
    }

    // 2. High-performance In-Memory Waterfall with Health & Round-Robin
    for (const tier of TIER_ORDER) {
      const eligibleModels: Array<{ provider: ProviderConfig; model: ModelConfig; key: string }> = [];

      for (const provider of PROVIDERS_CONFIG) {
        if (!provider.enabled) continue;
        for (const model of provider.models) {
          if (model.tier !== tier) continue;
          const key = `${provider.name}::${model.modelName}`;

          if (excludedModelIds.includes(key) || excludedModelIds.includes(model.modelName)) {
            continue;
          }

          if (!this.health.isModelHealthy(key)) {
            continue;
          }

          if (requiredTags && requiredTags.length > 0) {
            const hasAllTags = requiredTags.every((t) => model.tags.includes(t));
            if (!hasAllTags) continue;
          }

          eligibleModels.push({ provider, model, key });
        }
      }

      if (eligibleModels.length > 0) {
        // Round-robin spread across eligible models in this tier
        const lastIdx = this.roundRobinIndexes.get(tier) || 0;
        const selectedIdx = (lastIdx + 1) % eligibleModels.length;
        this.roundRobinIndexes.set(tier, selectedIdx);

        const chosen = eligibleModels[selectedIdx];
        return {
          modelId: chosen.key,
          modelName: chosen.model.modelName,
          providerId: chosen.provider.name,
          providerName: chosen.provider.name,
          baseUrl: chosen.provider.baseUrl,
          tier: chosen.model.tier,
          averageLatency: null,
          overallScore: 90.0,
        };
      }
    }

    return null;
  }
}
