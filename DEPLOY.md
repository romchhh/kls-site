# 🚀 Інструкція з деплою KLS Site

## Передумови

- Node.js 18+ та npm
- PostgreSQL 12+
- Доступ до сервера (SSH)

## Крок 1: Підготовка сервера

### Встановлення Node.js та npm

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Перевірка версії
node --version
npm --version
```

### Встановлення PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Запуск PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Створення бази даних
sudo -u postgres psql
```

В консолі PostgreSQL:
```sql
CREATE DATABASE kls_site;
CREATE USER kls_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kls_site TO kls_user;
\q
```

## Крок 2: Клонування та налаштування проєкту

```bash
# Клонуйте репозиторій (або завантажте файли)
cd /var/www  # або інша директорія
git clone <your-repo-url> kls-site
cd kls-site

# Створіть .env файл
cp .env.example .env
nano .env  # або vim .env
```

### Налаштування .env файлу

```env
# Database
DATABASE_URL="postgresql://kls_user:your_secure_password@localhost:5432/kls_site?schema=public"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"  # або http://your-ip:3000
NEXTAUTH_SECRET="your-secret-key-here"  # згенеруйте: npm run generate:secret

# Node Environment
NODE_ENV="production"
```

## Крок 3: Встановлення залежностей та міграції

```bash
# Встановлення залежностей
npm install

# Генерація Prisma Client
npx prisma generate

# Запуск міграцій
npx prisma migrate deploy

# Збірка проєкту
npm run build
```

## Крок 4: Створення суперадміна

```bash
npx tsx scripts/create-superadmin.ts
```

Введіть дані:
- Email: ваш email
- Пароль: надійний пароль
- Ім'я: ваше ім'я
- Телефон: ваш телефон

## Крок 5: Запуск сервера

### Варіант 1: Використання PM2 (рекомендовано)

```bash
# Встановлення PM2 глобально
npm install -g pm2

# Створення директорії для логів
mkdir -p logs

# Запуск через PM2
pm2 start ecosystem.config.js

# Збереження конфігурації PM2
pm2 save
pm2 startup  # слідуйте інструкціям

# Корисні команди PM2
pm2 status          # статус
pm2 logs            # логи
pm2 restart kls-site # перезапуск
pm2 stop kls-site   # зупинка
```

### Варіант 2: Використання systemd

Створіть файл `/etc/systemd/system/kls-site.service`:

```ini
[Unit]
Description=KLS Site Next.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/kls-site
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Запуск:
```bash
sudo systemctl daemon-reload
sudo systemctl enable kls-site
sudo systemctl start kls-site
sudo systemctl status kls-site
```

### Варіант 3: Прямий запуск (не для production)

```bash
npm start
```

## Крок 6: Налаштування Nginx (опціонально)

Якщо використовуєте Nginx як reverse proxy:

```bash
sudo apt install nginx
```

Створіть конфігурацію `/etc/nginx/sites-available/kls-site`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активуйте конфігурацію:
```bash
sudo ln -s /etc/nginx/sites-available/kls-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Крок 7: Налаштування SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Оновлення проєкту

```bash
# Отримати останні зміни
git pull

# Встановити нові залежності
npm install

# Оновити Prisma Client
npx prisma generate

# Запустити нові міграції
npx prisma migrate deploy

# Перебудувати проєкт
npm run build

# Перезапустити сервер
pm2 restart kls-site  # або systemctl restart kls-site
```

## Створення додаткових адмінів

Після входу як суперадмін:
1. Перейдіть на `/admin/dashboard`
2. Вкладка "Адміністратори"
3. Натисніть "Створити адміністратора"

## Перевірка роботи

1. Відкрийте `http://your-ip:3000` або `https://yourdomain.com`
2. Перейдіть на `/admin/login`
3. Увійдіть з даними суперадміна

## Troubleshooting

### Помилка підключення до БД
- Перевірте `DATABASE_URL` в `.env`
- Перевірте, чи запущений PostgreSQL: `sudo systemctl status postgresql`
- Перевірте права доступу користувача БД

### Помилка міграцій
```bash
npx prisma migrate status
npx prisma migrate resolve --applied <migration-name>
```

### Перегляд логів
```bash
# PM2
pm2 logs kls-site

# systemd
sudo journalctl -u kls-site -f

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Порт вже зайнятий
```bash
# Знайти процес на порту 3000
sudo lsof -i :3000
# Або змініть PORT в ecosystem.config.js
```

## Безпека

1. **Ніколи не комітьте `.env` файл**
2. Використовуйте сильні паролі для БД та суперадміна
3. Налаштуйте firewall:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
4. Регулярно оновлюйте залежності: `npm audit fix`

## Підтримка

При виникненні проблем перевірте:
- Логи PM2: `pm2 logs`
- Логи Nginx: `/var/log/nginx/`
- Статус сервісів: `systemctl status postgresql`, `systemctl status nginx`

