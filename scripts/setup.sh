#!/bin/bash

echo "🚀 Налаштування проекту KLS Site"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Створення .env файлу..."
    cp .env.example .env
    echo "✅ .env файл створено"
    echo ""
    
    # Generate NEXTAUTH_SECRET
    echo "🔑 Генерація NEXTAUTH_SECRET..."
    SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    
    # Update .env file with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    else
        # Linux
        sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    fi
    
    echo "✅ NEXTAUTH_SECRET згенеровано та додано в .env"
    echo ""
    echo "⚠️  ВАЖЛИВО: Відредагуйте .env файл та вкажіть:"
    echo "   - DATABASE_URL (підключення до PostgreSQL)"
    echo "   Приклад: postgresql://postgres:password@localhost:5432/kls_site?schema=public"
    echo ""
    read -p "Натисніть Enter після налаштування DATABASE_URL в .env файлі..."
else
    echo "✅ .env файл вже існує"
    echo "⚠️  Переконайтеся, що DATABASE_URL та NEXTAUTH_SECRET налаштовані"
fi

# Install dependencies
echo ""
echo "📦 Встановлення залежностей..."
npm install

# Generate Prisma Client
echo ""
echo "🔧 Генерація Prisma Client..."
npx prisma generate

# Run migrations
echo ""
echo "🗄️  Запуск міграцій бази даних..."
echo "⚠️  Переконайтеся, що PostgreSQL запущений та DATABASE_URL правильний!"
npx prisma migrate dev --name init

# Create superadmin
echo ""
echo "👤 Створення суперадміна..."
npx tsx scripts/init-db.ts

echo ""
echo "✅ Налаштування завершено!"
echo ""
echo "📋 Наступні кроки:"
echo "   1. Запустіть dev сервер: npm run dev"
echo "   2. Відкрийте /admin/login для входу"
echo "   3. Використайте дані суперадміна, які ви щойно створили"
