import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

/**
 * AppController exposes infrastructure endpoints.
 */
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck(): object {
    return this.appService.healthCheck();
  }
}
