import { Injectable, Logger } from '@nestjs/common';
import { RouterSelectorService } from './router-selector.service';
import { RouterReservationService } from './router-reservation.service';
import { RouterHealthService } from './router-health.service';
import { RouterLoggerService } from './router-logger.service';
import { ProviderDispatcherService, ChatMessage } from './provider-dispatcher.service';
import { v4 as uuidv4 } from 'uuid';

export interface RouteResult {
  content: string;
  provider: string;
  model: string;
  tier: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
}

const MAX_RETRIES = 5;

@Injectable()
export class RouterGraphService {
  private readonly logger = new Logger(RouterGraphService.name);

  constructor(
    private selector: RouterSelectorService,
    private reservation: RouterReservationService,
    private health: RouterHealthService,
    private routerLogger: RouterLoggerService,
    private dispatcher: ProviderDispatcherService,
  ) {}

  async execute(
    messages: ChatMessage[],
    estimatedTokens: number = 600,
    requiredTags: string[] | null = null,
  ): Promise<RouteResult> {
    const requestUuid = uuidv4();
    const failedModels: string[] = [];

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      // 1. SELECT NODE (Waterfall & Round-Robin)
      const candidate = await this.selector.selectModelWaterfall(
        estimatedTokens,
        failedModels,
        requiredTags,
      );

      if (!candidate) {
        await this.routerLogger.logRequest({
          requestUuid,
          providerName: 'none',
          modelName: 'none',
          tier: 'NONE',
          status: 'failure',
          attempt,
          errorMessage: 'All model tiers exhausted in router waterfall.',
        });
        throw new Error('All model tiers exhausted in router waterfall.');
      }

      // 2. RESERVATION NODE (Quota Check & 2-Phase Lock)
      const resId = await this.reservation.reserve(
        requestUuid,
        candidate.modelId,
        estimatedTokens,
      );

      if (!resId) {
        this.logger.warn(
          `Quota race or ceiling reached on ${candidate.modelName}. Adding to exclusion and retrying.`,
        );
        failedModels.push(candidate.modelId);
        continue;
      }

      this.logger.log(
        `[Attempt ${attempt}] Router routed to: provider=${candidate.providerName} model=${candidate.modelName} tier=${candidate.tier}`,
      );

      // 3. LLM NODE
      try {
        const response = await this.dispatcher.call(
          candidate.providerName,
          candidate.modelName,
          candidate.baseUrl,
          messages,
        );

        // 4. UPDATE NODE (Commit Quota, EMA Latency, Structured Log)
        await this.reservation.confirm(
          resId,
          candidate.modelId,
          response.promptTokens + response.completionTokens,
          estimatedTokens,
        );
        await this.health.updateSuccess(candidate.modelId, response.latencyMs);
        await this.routerLogger.logRequest({
          requestUuid,
          providerName: candidate.providerName,
          modelName: candidate.modelName,
          tier: candidate.tier,
          status: 'success',
          attempt,
          promptTokens: response.promptTokens,
          completionTokens: response.completionTokens,
          latencyMs: response.latencyMs,
          httpStatus: 200,
        });

        return {
          content: response.content,
          provider: candidate.providerName,
          model: candidate.modelName,
          tier: candidate.tier,
          latencyMs: response.latencyMs,
          promptTokens: response.promptTokens,
          completionTokens: response.completionTokens,
        };
      } catch (err: any) {
        this.logger.error(
          `[Attempt ${attempt}] Call failed on ${candidate.providerName}/${candidate.modelName}: ${err.message}`,
        );

        // 5. HANDLE FAILURE NODE (Release Quota, Health Backoff, Log)
        await this.reservation.release(resId, candidate.modelId, estimatedTokens);
        await this.health.updateFailure(candidate.modelId);
        await this.routerLogger.logRequest({
          requestUuid,
          providerName: candidate.providerName,
          modelName: candidate.modelName,
          tier: candidate.tier,
          status: 'retry',
          attempt,
          errorMessage: err.message,
          httpStatus: 500,
        });

        failedModels.push(candidate.modelId);
      }
    }

    throw new Error(`Router failed after ${MAX_RETRIES} attempts across providers.`);
  }
}
