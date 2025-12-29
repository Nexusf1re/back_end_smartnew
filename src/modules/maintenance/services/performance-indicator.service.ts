import { Injectable, BadRequestException } from '@nestjs/common';
import { PerformanceIndicatorRepository } from '../repositories/performance-indicator.repository';
import { DateUtils } from '../../../common/utils/date.utils';
import { PerformanceIndicatorDataDto } from '../dtos/performance-indicator.dto';

@Injectable()
export class PerformanceIndicatorService {
  constructor(
    private readonly repository: PerformanceIndicatorRepository,
  ) {}

  async getPerformanceIndicators(
    clientId: number,
    startDateStr?: string,
    endDateStr?: string,
    typeMaintenanceStr?: string,
    onlyWithDowntime: boolean = false,
  ): Promise<PerformanceIndicatorDataDto[]> {
    const startDate = startDateStr
      ? this.validateAndParseDate(startDateStr)
      : DateUtils.thirtyDaysAgo();

    const endDate = endDateStr
      ? this.validateAndParseDate(endDateStr)
      : DateUtils.today();

    if (startDate >= endDate) {
      throw new BadRequestException(
        'startDate deve ser anterior a endDate',
      );
    }

    const typeMaintenanceIds = typeMaintenanceStr
      ? this.parseTypeMaintenanceIds(typeMaintenanceStr)
      : undefined;

    const results = await this.repository.getPerformanceIndicators(
      clientId,
      startDate,
      endDate,
      typeMaintenanceIds,
      onlyWithDowntime,
    );

    return results.map((result) => this.ensurePrecision(result));
  }

  private validateAndParseDate(dateStr: string): Date {
    if (!DateUtils.isValidDate(dateStr)) {
      throw new BadRequestException(
        `Data inválida: ${dateStr}. Use formato YYYY-MM-DD`,
      );
    }
    return DateUtils.parseDate(dateStr);
  }

  private parseTypeMaintenanceIds(typeMaintenanceStr: string): number[] {
    try {
      return typeMaintenanceStr
        .split(',')
        .map((id) => {
          const parsed = parseInt(id.trim(), 10);
          if (isNaN(parsed)) {
            throw new Error(`ID inválido: ${id}`);
          }
          return parsed;
        });
    } catch (error) {
      throw new BadRequestException(
        `typeMaintenance inválido: ${(error as Error).message}. Use formato: "1,2,3"`,
      );
    }
  }

  private ensurePrecision(data: any): PerformanceIndicatorDataDto {
    const toNumber = (value: any) => {
      if (value === null || value === undefined) return 0;
      if (typeof value === 'bigint') return Number(value);
      return Number(value) || 0;
    };

    const df = toNumber(data.DF);
    const mtbf = toNumber(data.MTBF);
    const mttr = toNumber(data.MTTR);
    const paradas = toNumber(data.Paradas);
    const tempoPrev = toNumber(data.tempo_prev);
    const tempoCorretiva = toNumber(data.tempo_corretiva);

    return {
      Familia: data.Familia || 'N/A',
      DF: this.limitDecimals(Math.max(0, Math.min(100, df)), 2),
      MTBF: this.limitDecimals(Math.max(0, mtbf), 2),
      MTTR: this.limitDecimals(Math.max(0, mttr), 2),
      Paradas: Math.max(0, paradas),
      tempo_prev: Math.max(0, tempoPrev),
      tempo_corretiva: Math.max(0, tempoCorretiva),
    };
  }

  private limitDecimals(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}