import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { StoresService } from './stores.service.js';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STORE_OWNER')
export class OwnerController {
  constructor(private readonly storesService: StoresService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.storesService.getOwnerDashboard(user.sub);
  }
}
