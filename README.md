# KLS Logistics

Next.js site and admin cabinet for KLS Logistics (shipping, invoices, client portal).

## Stack

- Next.js 15 (App Router)
- React 18
- Prisma + PostgreSQL
- NextAuth (credentials)
- Tailwind CSS

## Setup

```bash
npm install
cp .env.example .env   # if present; otherwise configure .env manually
npm run db:generate
npm run db:migrate
npm run create-superadmin
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:migrate:deploy` | Deploy migrations (prod) |
| `npm run db:seed` | Seed DB |
| `npm run create-superadmin` | Create/reset superadmin |
| `npm run generate:secret` | Generate `NEXTAUTH_SECRET` |

## Docs

- `API_DOCUMENTATION.md` — public/admin API reference
- `KLS_API_Collection.postman_collection.json` — Postman collection
