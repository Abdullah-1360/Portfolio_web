import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class RouterDbService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;
  private isPostgresAvailable = false;
  private readonly logger = new Logger(RouterDbService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const dsn = this.configService.get<string>('DATABASE_URL');
    if (dsn) {
      try {
        this.pool = new Pool({
          connectionString: dsn,
          min: 2,
          max: 20,
          connectionTimeoutMillis: 3000,
          statement_timeout: 10000,
        });

        // Verify connection health
        const client = await this.pool.connect();
        await client.query('SELECT 1');
        client.release();
        this.isPostgresAvailable = true;
        this.logger.log('PostgreSQL Router DB connection established (min: 2, max: 20)');
      } catch (err: any) {
        this.logger.warn(`PostgreSQL unavailable (${err.message}). Router running in high-performance in-memory atomic state mode.`);
        this.isPostgresAvailable = false;
      }
    } else {
      this.logger.log('DATABASE_URL not set. Running in-memory atomic state mode.');
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('PostgreSQL Router DB connection closed');
    }
  }

  getPool(): Pool | null {
    return this.pool;
  }

  hasPostgres(): boolean {
    return this.isPostgresAvailable && this.pool !== null;
  }
}
