import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';

/**
 * AppModule is the root NestJS module.
 *
 * - ConfigModule.forRoot() loads the .env file and exposes process.env
 *   throughout the application.
 * - PrismaModule (global) provides PrismaService to every other module
 *   without requiring explicit imports.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
