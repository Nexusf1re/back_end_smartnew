import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfig {
  constructor(private configService: ConfigService) {}

  get app() {
    return {
      nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
      port: this.configService.get<number>('PORT', 3000),
    };
  }

  get cors() {
    const origin = this.configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
    return {
      origin: origin.split(',').map((o: string) => o.trim()),
    };
  }

  get clientId() {
    return this.configService.get<number>('CLIENT_ID', 405);
  }
}
