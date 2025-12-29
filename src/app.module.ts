import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { EnvironmentConfig } from './config/environment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MaintenanceModule,
  ],
  providers: [EnvironmentConfig],
})
export class AppModule {}
