import { Injectable } from '@nestjs/common';

/**
 * AppService holds application-level helpers.
 * Feature-specific logic (users, stores, ratings) lives in its own module.
 */
@Injectable()
export class AppService {
  healthCheck(): object {
    return { status: 'ok', service: 'MyStore API' };
  }
}
