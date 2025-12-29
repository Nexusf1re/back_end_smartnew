import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DateUtils } from '../../../common/utils/date.utils';

export interface KPICalculationResult {
  Familia: string;
  DF: number;
  MTBF: number;
  MTTR: number;
  Paradas: number;
  tempo_prev: number;
  tempo_corretiva: number;
}

@Injectable()
export class PerformanceIndicatorRepository {
  constructor(private prisma: PrismaService) {}

  async getPerformanceIndicators(
    clientId: number,
    startDate: Date,
    endDate: Date,
    typeMaintenanceIds?: number[],
    onlyWithDowntime: boolean = false,
  ): Promise<KPICalculationResult[]> {
    const typeMaintenanceFilter = typeMaintenanceIds?.length
      ? `AND os.tipo_manutencao IN (${typeMaintenanceIds.join(',')})`
      : '';

    const downttimeFilter = onlyWithDowntime ? 'HAVING Paradas > 0' : '';

    const query = `
      SELECT
        f.familia as Familia,
        COALESCE(ROUND(
          ((SUM(TIMESTAMPDIFF(HOUR, est.inicio, est.termino)) - 
            COALESCE(SUM(TIMESTAMPDIFF(HOUR, ap.data_hora_stop, ap.data_hora_start)), 0)) / 
            NULLIF(SUM(TIMESTAMPDIFF(HOUR, est.inicio, est.termino)), 0) * 100), 2), 0) as DF,
        COALESCE(ROUND(
          (SUM(TIMESTAMPDIFF(HOUR, est.inicio, est.termino)) - 
            COALESCE(SUM(TIMESTAMPDIFF(HOUR, ap.data_hora_stop, ap.data_hora_start)), 0)) / 
            NULLIF(COUNT(DISTINCT os.id), 0), 2), 0) as MTBF,
        COALESCE(ROUND(
          COALESCE(SUM(TIMESTAMPDIFF(HOUR, ap.data_hora_stop, ap.data_hora_start)), 0) / 
            NULLIF(COUNT(DISTINCT os.id), 1), 2), 0) as MTTR,
        COUNT(DISTINCT os.id) as Paradas,
        COALESCE(SUM(TIMESTAMPDIFF(HOUR, est.inicio, est.termino)), 0) as tempo_prev,
        COALESCE(SUM(TIMESTAMPDIFF(HOUR, ap.data_hora_stop, ap.data_hora_start)), 0) as tempo_corretiva
      FROM
        cadastro_de_familias_de_equipamento f
      LEFT JOIN cadastro_de_equipamentos e ON f.id = e.ID_familia AND e.ID_cliente = ?
      LEFT JOIN sofman_prospect_escala_trabalho est ON e.id = est.id_equipamento 
        AND DATE(est.data_programada) BETWEEN DATE(?) AND DATE(?)
      LEFT JOIN sofman_apontamento_paradas ap ON e.id = ap.id_equipamento 
        AND DATE(ap.data_hora_stop) BETWEEN DATE(?) AND DATE(?)
      LEFT JOIN controle_de_ordens_de_servico os ON ap.id_ordem_servico = os.id 
        AND os.ID_cliente = ?
        ${typeMaintenanceFilter}
      WHERE
        f.ID_cliente = ?
      GROUP BY
        f.id, f.familia
      ${downttimeFilter}
      ORDER BY
        f.familia ASC;
    `;

    return await this.prisma.$queryRawUnsafe<KPICalculationResult[]>(
      query,
      clientId,
      startDate,
      endDate,
      startDate,
      endDate,
      clientId,
      clientId,
    );
  }

}
