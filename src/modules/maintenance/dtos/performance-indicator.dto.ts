import { IsString, IsOptional, IsNumber } from 'class-validator';
import { z } from 'zod';

// Schema Zod para validação
export const performanceIndicatorQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser YYYY-MM-DD').optional(),
  typeMaintenance: z.string().regex(/^\d+(,\d+)*$/, 'Formato deve ser: 1,2,3').optional(),
  onlyWithDowntime: z.enum(['true', 'false']).optional(),
});

export type PerformanceIndicatorQuery = z.infer<typeof performanceIndicatorQuerySchema>;

export class PerformanceIndicatorQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  typeMaintenance?: string;

  @IsOptional()
  @IsString()
  onlyWithDowntime?: string;
}

export class PerformanceIndicatorDataDto {
  @IsString()
  Familia!: string;

  @IsNumber()
  DF!: number;

  @IsNumber()
  MTBF!: number;

  @IsNumber()
  MTTR!: number;

  @IsNumber()
  Paradas!: number;

  @IsNumber()
  tempo_prev!: number;

  @IsNumber()
  tempo_corretiva!: number;
}

export class PerformanceIndicatorResponseDto {
  success!: boolean;
  data!: PerformanceIndicatorDataDto[];
  error?: string;
  statusCode?: number;
}
