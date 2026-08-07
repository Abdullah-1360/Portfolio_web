/**
 * Multi-Provider & Model Registry (Tiers & Quotas)
 * Directly matches production-grade specifications and multi-key capabilities.
 */

export interface ModelQuotaConfig {
  quotaType: 'REQUESTS' | 'TOKENS';
  window: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | 'MONTH' | 'LIFETIME';
  limitValue: number;
}

export interface ModelConfig {
  modelName: string;
  displayName: string;
  tier: 'PRIMARY_FREE' | 'SECONDARY_FREE' | 'LIMITED_FREE' | 'PAID' | 'LOCAL';
  contextWindow: number;
  maxOutputTokens: number;
  tags: string[];
  quotas: ModelQuotaConfig[];
  vision?: boolean;
  tools?: boolean;
  reasoning?: boolean;
  coding?: boolean;
  chat?: boolean;
}

export interface ProviderConfig {
  name: string;
  displayName: string;
  providerType: 'cloud' | 'local' | 'paid';
  tier: 'PRIMARY_FREE' | 'SECONDARY_FREE' | 'LIMITED_FREE' | 'PAID' | 'LOCAL';
  priority: number;
  enabled: boolean;
  baseUrl: string;
  models: ModelConfig[];
}

export const PROVIDERS_CONFIG: ProviderConfig[] = [
  {
    name: 'gemini',
    displayName: 'Google Gemini (Multi-Key Pool)',
    providerType: 'cloud',
    priority: 1,
    tier: 'PRIMARY_FREE',
    enabled: true,
    baseUrl: 'https://generativelanguage.googleapis.com',
    models: [
      {
        modelName: 'gemini-2.5-flash',
        displayName: 'Gemini 2.5 Flash',
        tier: 'PRIMARY_FREE',
        contextWindow: 1048576,
        maxOutputTokens: 65536,
        tags: ['reasoning', 'vision', 'tool-calling', 'coding', 'fast', 'large-context'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 15 },
          { quotaType: 'TOKENS', window: 'MINUTE', limitValue: 1000000 },
          { quotaType: 'REQUESTS', window: 'DAY', limitValue: 1500 },
        ],
      },
      {
        modelName: 'gemini-2.0-flash',
        displayName: 'Gemini 2.0 Flash',
        tier: 'PRIMARY_FREE',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        tags: ['reasoning', 'vision', 'fast', 'coding'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 15 },
          { quotaType: 'TOKENS', window: 'MINUTE', limitValue: 1000000 },
        ],
      },
      {
        modelName: 'gemini-2.5-pro',
        displayName: 'Gemini 2.5 Pro',
        tier: 'PRIMARY_FREE',
        contextWindow: 1048576,
        maxOutputTokens: 65536,
        tags: ['reasoning', 'vision', 'tool-calling', 'coding', 'large-context'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 5 },
          { quotaType: 'TOKENS', window: 'MINUTE', limitValue: 250000 },
          { quotaType: 'REQUESTS', window: 'DAY', limitValue: 50 },
        ],
      },
    ],
  },
  {
    name: 'groq',
    displayName: 'Groq LPUs (Multi-Key Pool)',
    providerType: 'cloud',
    priority: 2,
    tier: 'PRIMARY_FREE',
    enabled: true,
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      {
        modelName: 'llama-3.3-70b-versatile',
        displayName: 'Llama 3.3 70B Versatile',
        tier: 'PRIMARY_FREE',
        contextWindow: 131072,
        maxOutputTokens: 8192,
        tags: ['fast', 'tool-calling', 'coding', 'reasoning'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 30 },
          { quotaType: 'TOKENS', window: 'MINUTE', limitValue: 30000 },
        ],
      },
      {
        modelName: 'llama-3.1-8b-instant',
        displayName: 'Llama 3.1 8B Instant',
        tier: 'PRIMARY_FREE',
        contextWindow: 131072,
        maxOutputTokens: 8192,
        tags: ['fast', 'tool-calling', 'coding', 'small'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 30 },
          { quotaType: 'TOKENS', window: 'MINUTE', limitValue: 30000 },
        ],
      },
    ],
  },
  {
    name: 'deepseek',
    displayName: 'DeepSeek AI (Multi-Key Pool)',
    providerType: 'cloud',
    priority: 3,
    tier: 'PRIMARY_FREE',
    enabled: true,
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      {
        modelName: 'deepseek-chat',
        displayName: 'DeepSeek-V3 Chat',
        tier: 'PRIMARY_FREE',
        contextWindow: 65536,
        maxOutputTokens: 8192,
        tags: ['deepseek', 'coding', 'reasoning', 'high-quality'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 60 },
          { quotaType: 'TOKENS', window: 'MINUTE', limitValue: 100000 },
        ],
      },
      {
        modelName: 'deepseek-reasoner',
        displayName: 'DeepSeek-R1 Reasoner',
        tier: 'PRIMARY_FREE',
        contextWindow: 65536,
        maxOutputTokens: 8192,
        tags: ['deepseek', 'reasoning', 'math', 'coding'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 30 },
        ],
      },
    ],
  },
  {
    name: 'mistral',
    displayName: 'Mistral AI (Multi-Key Pool)',
    providerType: 'cloud',
    priority: 4,
    tier: 'LIMITED_FREE',
    enabled: true,
    baseUrl: 'https://api.mistral.ai/v1',
    models: [
      {
        modelName: 'mistral-small-latest',
        displayName: 'Mistral Small',
        tier: 'LIMITED_FREE',
        contextWindow: 32768,
        maxOutputTokens: 8192,
        tags: ['mistral', 'fast', 'coding'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'SECOND', limitValue: 1 },
        ],
      },
      {
        modelName: 'codestral-latest',
        displayName: 'Codestral (Code Specialist)',
        tier: 'LIMITED_FREE',
        contextWindow: 32768,
        maxOutputTokens: 8192,
        tags: ['mistral', 'coding', 'specialist'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'SECOND', limitValue: 1 },
        ],
      },
    ],
  },
  {
    name: 'cerebras',
    displayName: 'Cerebras Wafer-Scale (Multi-Key Pool)',
    providerType: 'cloud',
    priority: 5,
    tier: 'LIMITED_FREE',
    enabled: true,
    baseUrl: 'https://api.cerebras.ai/v1',
    models: [
      {
        modelName: 'llama3.1-70b',
        displayName: 'Llama 3.1 70B (Cerebras Ultra-Fast)',
        tier: 'LIMITED_FREE',
        contextWindow: 8192,
        maxOutputTokens: 4096,
        tags: ['ultra-fast', 'cerebras', 'reasoning'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 30 },
        ],
      },
    ],
  },
  {
    name: 'openrouter',
    displayName: 'OpenRouter Free Tier',
    providerType: 'cloud',
    priority: 6,
    tier: 'SECONDARY_FREE',
    enabled: true,
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      {
        modelName: 'meta-llama/llama-3.3-70b-instruct:free',
        displayName: 'Llama 3.3 70B Instruct (Free)',
        tier: 'SECONDARY_FREE',
        contextWindow: 131072,
        maxOutputTokens: 8192,
        tags: ['openrouter', 'llama', 'free', 'coding'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 20 },
          { quotaType: 'REQUESTS', window: 'DAY', limitValue: 200 },
        ],
      },
    ],
  },
  {
    name: 'cohere',
    displayName: 'Cohere (Multi-Key Pool)',
    providerType: 'cloud',
    priority: 7,
    tier: 'LIMITED_FREE',
    enabled: true,
    baseUrl: 'https://api.cohere.com/v2',
    models: [
      {
        modelName: 'command-r',
        displayName: 'Command R',
        tier: 'LIMITED_FREE',
        contextWindow: 128000,
        maxOutputTokens: 4096,
        tags: ['cohere', 'rag', 'tool-calling'],
        quotas: [
          { quotaType: 'REQUESTS', window: 'MINUTE', limitValue: 20 },
        ],
      },
    ],
  },
];
