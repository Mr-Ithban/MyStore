import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { AuthService } from './auth.service.js';
import type { AuthenticatedUser } from './auth.types.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @Roles('ADMIN', 'USER', 'STORE_OWNER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.sub);
  }
}
