import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PerformanceIndicatorController } from './controllers/performance-indicator.controller';
import { PerformanceIndicatorService } from './services/performance-indicator.service';
import { PerformanceIndicatorRepository } from './repositories/performance-indicator.repository';
import { EnvironmentConfig } from '../../config/environment.config';

@Module({
  imports: [PrismaModule],
  controllers: [PerformanceIndicatorController],
  providers: [
    PerformanceIndicatorService,
    PerformanceIndicatorRepository,
    EnvironmentConfig,
  ],
  exports: [PerformanceIndicatorService],
})
export class MaintenanceModule {}
