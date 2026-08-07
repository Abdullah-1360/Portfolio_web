import { Injectable, Logger } from '@nestjs/common';
import { RouterDbService } from './router-db.service';

export interface LogRequestParams {
  requestUuid: string;
  providerName: string;
  modelName: string;
  tier: string;
  status: 'success' | 'failure' | 'retry';
  attempt?: number;
  promptTokens?: number;
  completionTokens?: number;
  latencyMs?: number;
  httpStatus?: number;
  errorMessage?: string;
}

@Injectable()
export class RouterLoggerService {
  private readonly nestLogger = new Logger('RouterLogger');

  constructor(private db: RouterDbService) {}

  async logRequest(params: LogRequestParams): Promise<void> {
    const totalTokens =
      params.promptTokens !== undefined && params.completionTokens !== undefined
        ? params.promptTokens + params.completionTokens
        : undefined;

    const logRecord = {
      ts: new Date().toISOString(),
      uuid: params.requestUuid,
      provider: params.providerName,
      model: params.modelName,
      tier: params.tier,
      status: params.status,
      attempt: params.attempt || 1,
      prompt_tokens: params.promptTokens,
      completion_tokens: params.completionTokens,
      total_tokens: totalTokens,
      latency_ms: params.latencyMs,
      http_status: params.httpStatus,
      error: params.errorMessage,
    };

    // Clean undefined fields for structured stdout
    const cleaned = Object.fromEntries(Object.entries(logRecord).filter(([_, v]) => v !== undefined));
    console.log(JSON.stringify(cleaned));

    // Async write to database if available
    if (this.db.hasPostgres()) {
      try {
        await this.db.getPool()!.query(
          `
          INSERT INTO request_log (
              request_uuid, status, prompt_tokens, completion_tokens, total_tokens,
              latency_ms, http_status, error_message, attempt
          ) VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9);
        `,
          [
            params.requestUuid,
            params.status,
            params.promptTokens || null,
            params.completionTokens || null,
            totalTokens || null,
            params.latencyMs || null,
            params.httpStatus || 200,
            params.errorMessage || null,
            params.attempt || 1,
          ],
        );
      } catch (err: any) {
        this.nestLogger.debug(`Database log persistence skipped: ${err.message}`);
      }
    }
  }
}
