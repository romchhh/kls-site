#!/bin/bash

set -e

echo "🚀 Деплой KLS Site на production сервер"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Файл .env не знайдено!${NC}"
    echo "Створіть .env файл на основі .env.example"
    echo "cp .env.example .env"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=" .env || grep -q "DATABASE_URL=\"\"" .env; then
    echo -e "${RED}❌ DATABASE_URL не налаштовано в .env файлі!${NC}"
    exit 1
fi

# Check if NEXTAUTH_SECRET is set
if ! grep -q "NEXTAUTH_SECRET=" .env || grep -q "NEXTAUTH_SECRET=\"\"" .env; then
    echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET не налаштовано. Генерую...${NC}"
    SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    else
        sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    fi
    echo -e "${GREEN}✅ NEXTAUTH_SECRET згенеровано${NC}"
fi

echo -e "${GREEN}📦 Встановлення залежностей...${NC}"
npm ci --production=false

echo -e "${GREEN}🔧 Генерація Prisma Client...${NC}"
npx prisma generate

echo -e "${GREEN}🗄️  Запуск міграцій бази даних...${NC}"
npx prisma migrate deploy

echo -e "${GREEN}🏗️  Збірка проєкту...${NC}"
npm run build

echo ""
echo -e "${GREEN}✅ Деплой завершено успішно!${NC}"
echo ""
echo "📋 Наступні кроки:"
echo "   1. Створіть суперадміна: npx tsx scripts/create-superadmin.ts"
echo "   2. Запустіть сервер: npm start (або використайте PM2)"
echo ""

