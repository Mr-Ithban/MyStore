import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply a global API prefix so all routes are available under /api
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env['CORS_ORIGIN']?.split(',').map((origin) => origin.trim())
      ?? 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env['PORT'] ?? 3000);
}

bootstrap();
