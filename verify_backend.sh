#!/bin/bash

# Script de verificação do backend simplificado
# Use: bash verify_backend.sh

echo "=================================================="
echo "   VERIFICAÇÃO DO BACKEND SIMPLIFICADO"
echo "=================================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar estrutura
echo -e "${YELLOW}[1/5] Verificando estrutura...${NC}"
if [ -f "src/main.ts" ] && [ -f "src/app.module.ts" ] && [ -d "src/modules/maintenance" ]; then
    echo -e "${GREEN}✓ Estrutura OK${NC}"
else
    echo -e "${RED}✗ Estrutura incorreta${NC}"
    exit 1
fi

# 2. Verificar dependências
echo -e "${YELLOW}[2/5] Verificando dependências...${NC}"
if [ -f "package.json" ] && grep -q "\"@nestjs/core\"" package.json; then
    echo -e "${GREEN}✓ Dependências essenciais presentes${NC}"
else
    echo -e "${RED}✗ Dependências faltando${NC}"
    exit 1
fi

# 3. Verificar node_modules
echo -e "${YELLOW}[3/5] Verificando node_modules...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules instalado${NC}"
else
    echo -e "${YELLOW}! Instalando dependências...${NC}"
    npm install > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependências instaladas${NC}"
    else
        echo -e "${RED}✗ Erro ao instalar dependências${NC}"
        exit 1
    fi
fi

# 4. Compilar TypeScript
echo -e "${YELLOW}[4/5] Compilando TypeScript...${NC}"
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Compilação OK${NC}"
else
    echo -e "${RED}✗ Erro na compilação${NC}"
    npm run build
    exit 1
fi

# 5. Verificar arquivo dist
echo -e "${YELLOW}[5/5] Verificando build...${NC}"
if [ -f "dist/main.js" ]; then
    echo -e "${GREEN}✓ Build gerado com sucesso${NC}"
else
    echo -e "${RED}✗ Build não foi criado${NC}"
    exit 1
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✓ TUDO OK! Backend pronto para testes${NC}"
echo "=================================================="
echo ""
echo "Próximos passos:"
echo "1. npm run dev      - Iniciar em modo desenvolvimento"
echo "2. npm run prod     - Executar versão de produção"
echo ""
echo "Rota de teste:"
echo "GET http://localhost:3000/api/maintenance/reports/performance-indicator"
echo ""
