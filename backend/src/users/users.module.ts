import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { UsersController } from './users.controller.js';

/** Placeholder for future user-management features. */
@Module({ imports: [AuthModule], controllers: [UsersController] })
export class UsersModule {}
