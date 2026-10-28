# Senator

Сайт ЖК «Senator». Репозиторій складається з двох частин (npm workspaces):

```
frontend/   React + Vite (сайт і адмінка) — деплоїться на Vercel
backend/    Express REST API + Prisma (PostgreSQL) — деплоїться окремо
```

## Запуск локально

```bash
npm install                 # ставить залежності обох частин і генерує Prisma Client
cp backend/.env.example backend/.env   # заповнити змінні
npm run dev:server          # API на http://localhost:3001
npm run dev                 # сайт на Vite, /api проксюється на 3001
```

## Інші команди

- `npm run build` — зібрати фронтенд у `frontend/dist`
- `npm start` — продакшн-запуск API
- `npm run lint` — лінт обох частин
- `npm run db:deploy` / `npm run db:seed` — міграції та стартові новини

Команди конкретної частини: `npm run <script> -w frontend` або `-w backend`.

## Деплой

Фронтенд і бекенд деплояться окремо. Потрібна Node.js 22.9+.

### 1. Бекенд — першим (Render, Railway, VPS тощо)

Команди виконуються з **кореня репозиторію** (там `package-lock.json`):

| Налаштування | Значення |
|---|---|
| Root Directory | корінь репозиторію |
| Build | `npm ci -w backend && npm run db:deploy` |
| Start | `npm start` |

Змінні середовища — з `backend/.env.example` (`DATABASE_URL`, `ADMIN_PASSWORD`,
`SESSION_SECRET`, `TELEGRAM_*`, `TRUST_PROXY=2`). `PORT` зазвичай задає сам хостинг.
Перевірка: `https://<адреса-бекенда>/api/news` повертає JSON.

### 2. Фронтенд — Vercel

1. У `frontend/vercel.json` замінити `YOUR-BACKEND-HOST` на адресу бекенда і закомітити.
2. На Vercel: Root Directory — `frontend`, Framework — Vite (решта за замовчуванням).

Vercel проксює `/api/*` на бекенд, тож для браузера це один домен:
CORS не потрібен, cookie адмінки працюють як є.
