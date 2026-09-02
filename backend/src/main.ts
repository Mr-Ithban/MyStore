import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply a global API prefix so all routes are available under /api
  app.setGlobalPrefix('api');

  await app.listen(process.env['PORT'] ?? 3000);
}

bootstrap();
