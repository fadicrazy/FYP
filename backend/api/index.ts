import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';

const server = express();
let app: any;

async function bootstrap() {
  if (!app) {
    const expressAdapter = new ExpressAdapter(server);
    app = await NestFactory.create(AppModule, expressAdapter);

    const configService = app.get(ConfigService);

    app.enableCors({
      origin: configService.get('FRONTEND_URL') || '*',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api');
    await app.init();
  }
  return server;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const expressApp = await bootstrap();
  expressApp(req, res);
}
