# Senator

Сайт ЖК «Senator». Репозиторій складається з двох частин (npm workspaces):

```
frontend/   React + Vite (сайт і адмінка)
backend/    Express API + Prisma (PostgreSQL)
api/        точка входу для Vercel — підключає backend/src/app.js
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
- `npm start` — продакшн-сервер: API + зібраний фронтенд
- `npm run lint` — лінт обох частин
- `npm run db:deploy` / `npm run db:seed` — міграції та стартові новини

Команди конкретної частини: `npm run <script> -w frontend` або `-w backend`.
