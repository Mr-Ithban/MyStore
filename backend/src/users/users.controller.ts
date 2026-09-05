import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { AuthenticatedUser } from '../auth/auth.types.js';
import { ChangePasswordDto } from '../auth/dto/change-password.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly authService: AuthService) {}
  @Patch('me/password')
  @Roles('ADMIN', 'USER', 'STORE_OWNER')
  async changePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(user.sub, dto);
    return { message: 'Password updated successfully.' };
  }
}
