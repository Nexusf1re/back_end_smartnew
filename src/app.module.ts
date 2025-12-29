import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnvironmentConfig } from './config/environment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    MaintenanceModule,
  ],
  providers: [EnvironmentConfig],
})
export class AppModule {}
