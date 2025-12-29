# Backend NestJS - Sistema de Indicadores de Performance de Manutenção

API REST desenvolvida em **NestJS** para cálculo e disponibilização de KPIs de manutenção industrial.

---

## 📋 Visão Geral

- **Framework:** NestJS 10 + TypeScript
- **ORM:** Prisma
- **Validação:** Zod + Class Validator
- **Banco:** MySQL (DigitalOcean)
- **Porta:** 3001

---

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite .env se necessário
```

### 3. Gerar Cliente Prisma
```bash
npm run prisma:generate
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3001/api**

---

## � Autenticação

A API utiliza **JWT (JSON Web Token)** para proteger endpoints sensíveis.

### Gerando um Token

**POST** `/api/auth/token`

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/token" -Method Post -ContentType "application/json" -Body "{}"

# curl
curl -X POST http://localhost:3001/api/auth/token -H "Content-Type: application/json" -d "{}"
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Body (opcional):**
```json
{
  "sub": "user-id",
  "clientId": 405,
  "expiresIn": "24h"
}
```

### Usando o Token

Adicione o header `Authorization: Bearer <token>` em requisições protegidas:

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/maintenance/reports/performance-indicator?startDate=2024-01-01&endDate=2024-12-31&typeMaintenance=1,2" -Method Get -Headers @{"Authorization"="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# curl
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  "http://localhost:3001/api/maintenance/reports/performance-indicator?startDate=2024-01-01&endDate=2024-12-31&typeMaintenance=1,2"
```

### Configuração JWT

No arquivo `.env`:
```env
JWT_SECRET=your_secret_key       # Chave secreta (trocar em produção)
JWT_EXPIRATION=24h               # Tempo de expiração do token
```

### Endpoints Protegidos

- ✅ `/api/maintenance/reports/*` - Requer autenticação

---

## 📡 Endpoints

### GET `/api/maintenance/reports/performance-indicator`

Retorna indicadores de performance (KPIs) de manutenção agrupados por família de equipamentos.

**🔒 Autenticação:** Requer Bearer Token

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Default | Exemplo |
|-----------|------|-------------|---------|---------|
| `startDate` | string (YYYY-MM-DD) | Não | 30 dias atrás | `2025-11-22` |
| `endDate` | string (YYYY-MM-DD) | Não | Hoje | `2025-12-22` |
| `typeMaintenance` | string | Não | - | `1,2,3` |

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "Familia": "COMPRESSORES",
      "DF": 85.50,
      "MTBF": 120.5,
      "MTTR": 4.2,
      "Paradas": 15,
      "tempo_prev": 1800,
      "tempo_corretiva": 63
    },
    {
      "Familia": "BOMBAS",
      "DF": 92.30,
      "MTBF": 240.8,
      "MTTR": 2.1,
      "Paradas": 8,
      "tempo_prev": 2400,
      "tempo_corretiva": 17
    }
  ]
}
```

#### Response (4xx/5xx Error)
```json
{
  "success": false,
  "error": "startDate deve ser anterior a endDate",
  "statusCode": 400,
  "data": []
}
```

---

## 📊 KPIs Calculados

### DF - Disponibilidade Física (%)
```
DF = ((tempo_prev - tempo_corretiva) / tempo_prev) × 100
```
Percentual de tempo que o equipamento esteve operacional.

### MTBF - Tempo Médio Entre Falhas (horas)
```
MTBF = (tempo_prev - tempo_corretiva) / Paradas
```
Quantidade média de horas entre falhas.

### MTTR - Tempo Médio Para Reparo (horas)
```
MTTR = tempo_corretiva / Paradas
```
Quantidade média de horas necessárias para reparar.

### Paradas - Quantidade de Falhas
Contagem total de ordens de serviço no período.

---

## 🏗️ Arquitetura

```
src/
├── config/              # Configurações globais
├── common/              # Utilitários e schemas
├── modules/
│   └── maintenance/
│       ├── controllers/ # Rotas HTTP
│       ├── services/    # Lógica de negócio
│       └── repositories/# Acesso a dados
├── prisma/             # ORM e modelos
└── main.ts             # Entrada da aplicação
```

---

## 📦 Scripts

```bash
# Desenvolvimento
npm run dev              # Inicia em watch mode
npm run debug           # Inicia com debugger

# Build
npm run build           # Compila TypeScript
npm run prod            # Executa versão de produção

# Prisma
npm run prisma:generate # Gera cliente Prisma
npm run prisma:migrate  # Executa migrations
npm run prisma:studio   # Abre Prisma Studio

# Qualidade
npm run lint            # Executa ESLint
npm run format          # Formata com Prettier
npm test                # Executa testes
npm run test:cov        # Testes com cobertura
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Banco de Dados
DATABASE_URL="mysql://user:pass@host:port/database"

# Aplicação
NODE_ENV=development
PORT=3001

# JWT (Autenticação)
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Filtro de Cliente
CLIENT_ID=405
```

---

## 🔐 Segurança

- ✅ Validação de entrada com Zod
- ✅ Sanitização de queries (Prisma)
- ✅ CORS configurado
- ✅ Tratamento de erros
- ✅ Logging estruturado

---

## 📚 Estrutura de Dados

### Tabelas Utilizadas

1. **sofman_prospect_escala_trabalho** - Escala de funcionamento
2. **sofman_apontamento_paradas** - Registro de paradas
3. **controle_de_ordens_de_servico** - Ordens de serviço
4. **cadastro_de_equipamentos** - Equipamentos
5. **cadastro_de_familias_de_equipamento** - Famílias

### Filtros

- **Cliente ID:** 405 (configurável em `.env`)
- **Período:** startDate a endDate (default: últimos 30 dias)
- **Tipo de Manutenção:** Opcional (separado por vírgula)

---

## ✅ Testes

### Exemplo de Requisição

```bash
curl "http://localhost:3001/api/maintenance/reports/performance-indicator?startDate=2025-11-22&endDate=2025-12-22"
```

### Com Filtro de Tipo de Manutenção

```bash
curl "http://localhost:3001/api/maintenance/reports/performance-indicator?startDate=2025-11-22&endDate=2025-12-22&typeMaintenance=1,2"
```

---

## 🐛 Troubleshooting

### Erro: "Connection refused"
- Verifique se o banco de dados está acessível
- Confirme `DATABASE_URL` no `.env`

### Erro: "Client not found"
- Verifique se há dados para o `CLIENT_ID` configurado

### Erro: "startDate deve ser anterior a endDate"
- Valide o formato das datas (YYYY-MM-DD)
- Garanta que startDate < endDate

---

## 📖 Documentação Relacionada

- **Frontend:** [test_back_end/README.md](../test_back_end/README.md)
- **Planejamento:** [PLANNING.md](./PLANNING.md)
- **Especificação Técnica:** [Teste_Backend_Pleno.html](../test_back_end/Teste_Backend_Pleno.html)

---

## 🚢 Deploy

### Build de Produção
```bash
npm run build
npm run prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "run", "prod"]
```

---

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Logs da aplicação (console)
2. Status do banco de dados
3. Variáveis de ambiente
4. Documentação do Prisma: https://www.prisma.io/docs/

---

## 📄 Licença

Projeto desenvolvido para fins de teste técnico.
