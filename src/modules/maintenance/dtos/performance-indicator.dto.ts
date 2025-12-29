import { IsString, IsOptional, IsNumber } from 'class-validator';

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
