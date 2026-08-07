import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ContactModule } from './contact/contact.module';
import { RouterModule } from './router/router.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PortfolioModule,
    ContactModule,
    RouterModule,
    AgentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
