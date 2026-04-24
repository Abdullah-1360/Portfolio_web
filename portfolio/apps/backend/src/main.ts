import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
      : '*',
    methods: ['GET', 'POST'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // ── Swagger / OpenAPI docs at /docs ──────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Abdullah Shahid — Portfolio API')
    .setDescription('REST API powering the portfolio frontend')
    .setVersion('1.0')
    .addTag('portfolio', 'Portfolio data endpoints')
    .addTag('contact',   'Contact form endpoint')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Portfolio API Docs',
    customCss: `.swagger-ui .topbar { background: #020817 }`,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Backend  → http://localhost:${port}/api`);
  console.log(`API Docs → http://localhost:${port}/docs`);
}
bootstrap();
