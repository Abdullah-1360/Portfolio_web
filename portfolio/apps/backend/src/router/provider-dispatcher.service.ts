import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderResponse {
  content: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  keyUsedIndex: number;
}

interface KeyHealth {
  key: string;
  disabledUntil: Date | null;
}

@Injectable()
export class ProviderDispatcherService {
  private readonly logger = new Logger(ProviderDispatcherService.name);
  private keyPools = new Map<string, KeyHealth[]>();
  private keyIndices = new Map<string, number>();

  constructor(private config: ConfigService) {
    this.initKeyPools();
  }

  private initKeyPools() {
    const registerPool = (provider: string, envPrefixes: string[]) => {
      const keys: string[] = [];
      for (const prefix of envPrefixes) {
        // Check single key
        const single = this.config.get<string>(prefix);
        if (single && !keys.includes(single)) {
          keys.push(single);
        }
        // Check indexed keys (e.g. _1 to _10)
        for (let i = 1; i <= 10; i++) {
          const indexed = this.config.get<string>(`${prefix}_${i}`);
          if (indexed && !keys.includes(indexed)) {
            keys.push(indexed);
          }
        }
      }

      this.keyPools.set(
        provider.toLowerCase(),
        keys.map((k) => ({ key: k, disabledUntil: null })),
      );
      this.keyIndices.set(provider.toLowerCase(), 0);
      this.logger.log(`Initialized Key Pool for [${provider}]: ${keys.length} active key(s)`);
    };

    registerPool('gemini', ['GEMINI_API_KEY', 'GOOGLE_API_KEY']);
    registerPool('groq', ['GROQ_API_KEY']);
    registerPool('mistral', ['MISTRAL_API_KEY']);
    registerPool('deepseek', ['DEEPSEEK_API_KEY']);
    registerPool('cerebras', ['CEREBRAS_API_KEY']);
    registerPool('cohere', ['COHERE_API_KEY']);
    registerPool('openrouter', ['OPENROUTER_API_KEY']);
    registerPool('openai', ['OPENAI_API_KEY']);
  }

  private getHealthyKey(provider: string): { key: string; index: number } {
    const pool = this.keyPools.get(provider.toLowerCase()) || [];
    if (pool.length === 0) {
      throw new Error(`No API keys configured for provider [${provider}]`);
    }

    const now = new Date();
    const startIndex = this.keyIndices.get(provider.toLowerCase()) || 0;

    // Check pool for available key
    for (let i = 0; i < pool.length; i++) {
      const idx = (startIndex + i) % pool.length;
      const keyObj = pool[idx];

      if (!keyObj.disabledUntil || keyObj.disabledUntil <= now) {
        keyObj.disabledUntil = null;
        this.keyIndices.set(provider.toLowerCase(), (idx + 1) % pool.length);
        return { key: keyObj.key, index: idx + 1 };
      }
    }

    // All keys in cooldown, return first key as best-effort
    return { key: pool[0].key, index: 1 };
  }

  private disableKey(provider: string, keyToDisable: string, cooldownSec: number = 60) {
    const pool = this.keyPools.get(provider.toLowerCase()) || [];
    const item = pool.find((k) => k.key === keyToDisable);
    if (item) {
      item.disabledUntil = new Date(Date.now() + cooldownSec * 1000);
      this.logger.warn(`Rate limit on [${provider}] key. Disabled for ${cooldownSec}s. Switching key in pool.`);
    }
  }

  async call(
    providerName: string,
    modelName: string,
    baseUrl: string | null,
    messages: ChatMessage[],
  ): Promise<ProviderResponse> {
    const p = providerName.toLowerCase();
    const maxKeyRetries = Math.min((this.keyPools.get(p) || []).length, 3);

    for (let attempt = 0; attempt < Math.max(1, maxKeyRetries); attempt++) {
      const { key, index } = this.getHealthyKey(p);
      const start = performance.now();

      try {
        switch (p) {
          case 'gemini':
            return await this.callGemini(modelName, messages, key, index, start);
          case 'groq':
            return await this.callOpenAICompatible(
              'https://api.groq.com/openai/v1',
              key,
              modelName,
              messages,
              index,
              start,
            );
          case 'deepseek':
            return await this.callOpenAICompatible(
              'https://api.deepseek.com',
              key,
              modelName,
              messages,
              index,
              start,
            );
          case 'mistral':
            return await this.callOpenAICompatible(
              'https://api.mistral.ai/v1',
              key,
              modelName,
              messages,
              index,
              start,
            );
          case 'cerebras':
            return await this.callOpenAICompatible(
              'https://api.cerebras.ai/v1',
              key,
              modelName,
              messages,
              index,
              start,
            );
          case 'openrouter':
            return await this.callOpenAICompatible(
              'https://openrouter.ai/api/v1',
              key,
              modelName,
              messages,
              index,
              start,
            );
          case 'openai':
            return await this.callOpenAICompatible(
              'https://api.openai.com/v1',
              key,
              modelName,
              messages,
              index,
              start,
            );
          case 'local':
            return await this.callOpenAICompatible(
              baseUrl || 'http://127.0.0.1:8080/v1',
              'local',
              modelName,
              messages,
              1,
              start,
            );
          default:
            throw new Error(`Unsupported provider: ${providerName}`);
        }
      } catch (err: any) {
        if (err.message.includes('429') || err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('rate limit')) {
          this.disableKey(p, key, 60);
          continue; // Try next key in the pool
        }
        throw err;
      }
    }

    throw new Error(`All active API keys exhausted for provider [${providerName}]`);
  }

  private async callGemini(
    modelName: string,
    messages: ChatMessage[],
    apiKey: string,
    keyIndex: number,
    start: number,
  ): Promise<ProviderResponse> {
    const cleanModel = modelName.startsWith('gemini') ? modelName : 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

    const systemMsg = messages.find((m) => m.role === 'system');
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    const body: any = { contents };
    if (systemMsg) {
      body.systemInstruction = { parts: [{ text: systemMsg.content }] };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const latencyMs = Math.round(performance.now() - start);
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const usage = data.usageMetadata || {};

    return {
      content,
      promptTokens: usage.promptTokenCount || 0,
      completionTokens: usage.candidatesTokenCount || 0,
      latencyMs,
      keyUsedIndex: keyIndex,
    };
  }

  private async callOpenAICompatible(
    baseUrl: string,
    apiKey: string,
    modelName: string,
    messages: ChatMessage[],
    keyIndex: number,
    start: number,
  ): Promise<ProviderResponse> {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Provider HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    const latencyMs = Math.round(performance.now() - start);
    const content = data.choices?.[0]?.message?.content || '';
    const usage = data.usage || {};

    return {
      content,
      promptTokens: usage.prompt_tokens || 0,
      completionTokens: usage.completion_tokens || 0,
      latencyMs,
      keyUsedIndex: keyIndex,
    };
  }
}
