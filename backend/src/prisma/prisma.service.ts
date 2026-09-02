import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from './db.js';

/**
 * Owns the application's Prisma client lifecycle.
 *
 * The existing project uses Prisma ORM Postgres, whose generated client is
 * exposed through the `client` property.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  readonly client = db;

  async onModuleInit(): Promise<void> {
    await this.client.connect();

    // Confirm the existing database is reachable without changing any data.
    await this.client.orm.public.User.first();

    this.logger.log('PostgreSQL connection established.');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
