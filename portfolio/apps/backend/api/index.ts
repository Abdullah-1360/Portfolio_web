import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import express from 'express';

const server = express();
let isReady = false;

async function bootstrap() {
  if (isReady) return;
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: false,
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
      : '*',
    methods: ['GET', 'POST'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Abdullah Shahid — Portfolio API')
    .setDescription('REST API powering the portfolio frontend')
    .setVersion('1.0')
    .addTag('portfolio')
    .addTag('contact')
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.init();
  isReady = true;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
