import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Serviço do prisma para gerenciar a conexão com o banco de dados usando NestJs
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }
  // Conecta ao banco de dados quando o módulo é inicializado
  async onModuleInit() {
    await this.$connect();
  }
  // Desconecta do banco de dados quando o módulo é destruído
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
