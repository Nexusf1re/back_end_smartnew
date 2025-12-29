import { Controller, Get, Query, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { PerformanceIndicatorService } from '../services/performance-indicator.service';
import {
  PerformanceIndicatorQueryDto,
  PerformanceIndicatorResponseDto,
  performanceIndicatorQuerySchema,
} from '../dtos/performance-indicator.dto';
import { EnvironmentConfig } from '../../../config/environment.config';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';

@Controller('maintenance/reports')
export class PerformanceIndicatorController {
  constructor(
    private readonly service: PerformanceIndicatorService,
    private readonly config: EnvironmentConfig,
  ) {}

  @Get('performance-indicator')
  @UsePipes(new ZodValidationPipe(performanceIndicatorQuerySchema))
  async getPerformanceIndicators(
    @Query() query: PerformanceIndicatorQueryDto,
  ): Promise<PerformanceIndicatorResponseDto> {
    try {
      const clientId = this.config.clientId;
      const onlyWithDowntime = query.onlyWithDowntime === 'true';

      const data = await this.service.getPerformanceIndicators(
        clientId,
        query.startDate,
        query.endDate,
        query.typeMaintenance,
        onlyWithDowntime,
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      const statusCode =
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        error instanceof HttpException
          ? error.message
          : 'Erro ao buscar indicadores de performance';

      return {
        success: false,
        error: message,
        statusCode,
        data: [],
      };
    }
  }
}
