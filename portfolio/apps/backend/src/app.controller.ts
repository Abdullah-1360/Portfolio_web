import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RouterDbService } from './router/router-db.service';
import { PROVIDERS_CONFIG } from './router/providers.config';
import { ConfigService } from '@nestjs/config';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly dbService: RouterDbService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  root() {
    return {
      status: 'ok',
      message: 'Abdullah Shahid — Portfolio & Multi-Provider AI Agent API',
      health: '/api/health',
      endpoints: {
        agentChat: '/api/agent/chat',
        portfolio: '/api/portfolio',
        projects: '/api/portfolio/projects',
        skills: '/api/portfolio/skills',
        experience: '/api/portfolio/experiences',
        contact: '/api/contact',
        docs: '/docs',
      },
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'System & Router Health Check', description: 'Returns system uptime, provider status, key counts, and DB connection state.' })
  @ApiResponse({ status: 200, description: 'Health check response' })
  health() {
    const isDbConnected = this.dbService.hasPostgres();

    // Check configured keys per provider
    const providersHealth = PROVIDERS_CONFIG.map((p) => {
      let keyCount = 0;
      const primaryKey = this.configService.get<string>(`${p.name.toUpperCase()}_API_KEY`);
      if (primaryKey) keyCount++;
      for (let i = 1; i <= 10; i++) {
        if (this.configService.get<string>(`${p.name.toUpperCase()}_API_KEY_${i}`)) {
          keyCount++;
        }
      }
      return {
        provider: p.displayName,
        tier: p.tier,
        models: p.models.map((m) => m.modelName),
        activeKeys: keyCount,
        status: keyCount > 0 || p.name === 'gemini' ? 'ready' : 'configured',
      };
    });

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'production',
      database: isDbConnected ? 'postgresql-connected' : 'in-memory-atomic-state',
      router: {
        status: 'active',
        resilienceGraph: 'enabled',
        maxRetries: 5,
        circuitBreaker: 'active',
        providers: providersHealth,
      },
    };
  }
}
