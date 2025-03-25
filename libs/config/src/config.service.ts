import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {
  DatabaseConfig,
  AppConfig,
  ProbationApiClientConfig,
} from './config.types';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get database(): DatabaseConfig {
    return {
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    };
  }

  get probationApiConfig(): ProbationApiClientConfig {
    return {
      baseUrl: this.configService.get<string>('PROBATION_API_URL'),
      apiKey: this.configService.get<string>('PROBATION_API_KEY'),
      pageSize: this.configService.get<number>('PROBATION_API_PAGE_SIZE'),
    };
  }

  get apiApp(): AppConfig {
    return {
      port: this.configService.get<number>('API_PORT'),
      environment: this.configService.get<string>('NODE_ENV') as
        | 'development'
        | 'production'
        | 'test',
    };
  }

  get workerApp(): AppConfig {
    return {
      port: this.configService.get<number>('WORKER_PORT'),
      environment: this.configService.get<string>('NODE_ENV') as
        | 'development'
        | 'production'
        | 'test',
    };
  }

  get<T>(key: string): T {
    return this.configService.get<T>(key);
  }
}
