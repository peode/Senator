# Senator

Сайт житлового комплексу «Senator»: публічні сторінки (про ЖК, планування секцій,
переваги, новини, контакти), форма заявки та адмін-панель для керування новинами й заявками.

## Технології

| Частина | Стек |
|---|---|
| `frontend/` | React 19, Vite, React Router, Tailwind CSS 4, shadcn/ui |
| `backend/` | Node.js, Express 5, Prisma 7, PostgreSQL, Zod |
| Інше | npm workspaces, ESLint, Telegram Bot API (сповіщення про заявки) |

## Структура проєкту

```
Senator/
├── package.json            # корінь: npm workspaces і загальні скрипти
├── frontend/               # сайт і адмінка (React + Vite) — деплой на Vercel
│   ├── src/
│   ├── vite.config.js      # у dev-режимі проксює /api → http://localhost:3001
│   └── vercel.json         # у продакшені проксює /api → бекенд
└── backend/                # REST API (Express + Prisma)
    ├── .env.example        # приклад змінних оточення
    ├── prisma.config.js
    ├── prisma/
    │   ├── schema.prisma   # моделі News і Lead
    │   ├── migrations/     # SQL-міграції
    │   └── seed.js         # стартові новини
    └── src/
        ├── index.js        # точка входу сервера
        ├── app.js
        ├── routes/         # /api/news, /api/leads, /api/session
        └── lib/
```

---

## Запуск локально — покроково

### Крок 0. Що потрібно встановити

- **Node.js 22.9 або новіша** (перевірка: `node -v`) — [nodejs.org](https://nodejs.org)
- **npm** (йде разом з Node.js)
- **Git**
- **PostgreSQL** — один із варіантів:
  - безкоштовна хмарна база [Neon](https://neon.tech) (нічого не треба ставити), або
  - локальний PostgreSQL 14+, або
  - Docker (див. крок 3)

### Крок 1. Клонувати репозиторій

```bash
git clone <URL-репозиторію> Senator
cd Senator
```

### Крок 2. Встановити залежності

Усі команди виконуються з **кореня репозиторію**. Одна команда ставить залежності
і фронтенду, і бекенду (npm workspaces):

```bash
npm install
```

Після встановлення автоматично виконується `prisma generate` (скрипт `postinstall`
у `backend/package.json`), тобто Prisma Client вже згенерований.

### Крок 3. Підготувати базу даних PostgreSQL

**Варіант А — Neon (хмара):**
1. Зареєструватися на [neon.tech](https://neon.tech) і створити проєкт.
2. Скопіювати Connection string. Для міграцій потрібен **прямий** рядок підключення
   (у хості **без** `-pooler`). Якщо скопіювали pooled-рядок — нічого страшного,
   `prisma.config.js` прибирає `-pooler` автоматично.

**Варіант Б — локальний PostgreSQL через Docker:**

```bash
docker run --name senator-db -e POSTGRES_USER=senator -e POSTGRES_PASSWORD=senator -e POSTGRES_DB=senator -p 5432:5432 -d postgres:16
```

Рядок підключення тоді: `postgresql://senator:senator@localhost:5432/senator`

**Варіант В — уже встановлений PostgreSQL:** створити порожню базу (наприклад, `senator`)
і використати рядок `postgresql://<користувач>:<пароль>@localhost:5432/senator`.

### Крок 4. Налаштувати змінні оточення

Скопіювати приклад і заповнити значення:

```bash
cp backend/.env.example backend/.env
```

Фронтенду окремий `.env` **не потрібен** — усі запити йдуть на відносний шлях `/api`.

#### Змінні оточення (`backend/.env`)

| Змінна | Обов'язкова | Опис |
|---|---|---|
| `DATABASE_URL` | **так** | Рядок підключення до PostgreSQL |
| `DATABASE_URL_UNPOOLED` | ні | Окремий прямий рядок для міграцій (якщо не задано — береться `DATABASE_URL` без `-pooler`) |
| `ADMIN_PASSWORD` | **так** | Пароль для входу в адмін-панель `/admin`. Без нього вхід неможливий |
| `SESSION_SECRET` | ні (рекомендовано) | Довгий випадковий рядок для підпису cookie сесії. Якщо порожній — використовується `ADMIN_PASSWORD` |
| `PORT` | ні | Порт API, за замовчуванням `3001` (Vite проксює саме на 3001) |
| `TRUST_PROXY` | ні | Кількість проксі перед сервером у продакшені (Vercel + хостинг = `2`) |
| `TELEGRAM_BOT_TOKEN` | ні | Токен Telegram-бота для сповіщень про нові заявки |
| `TELEGRAM_CHAT_ID` | ні | ID чату, куди бот надсилає заявки |

Згенерувати `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Приклад заповненого `backend/.env` для локального запуску

```env
DATABASE_URL=postgresql://senator:senator@localhost:5432/senator
ADMIN_PASSWORD=admin123
SESSION_SECRET=3f9c1a7e5b2d4f8a9c0e6b1d2a3f4e5c6b7a8d9e0f1a2b3c4d5e6f7a8b9c0d1e
PORT=3001
TRUST_PROXY=2
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

> ⚠️ Файл `.env` у `.gitignore` і **не комітиться**. Не публікуйте реальні паролі та токени.

#### Як отримати ключі Telegram (необов'язково)

Якщо `TELEGRAM_*` порожні, заявки все одно зберігаються в базу, просто без сповіщень.

1. У Telegram написати [@BotFather](https://t.me/BotFather) → `/newbot` → отримати токен → `TELEGRAM_BOT_TOKEN`.
2. Написати своєму боту будь-яке повідомлення (або додати бота в групу).
3. Відкрити `https://api.telegram.org/bot<ТОКЕН>/getUpdates` і взяти `chat.id` → `TELEGRAM_CHAT_ID`
   (для груп він від'ємний, наприклад `-1001234567890`).

### Крок 5. Налаштувати базу даних (Prisma)

```bash
# 1. Згенерувати Prisma Client (вже зроблено під час npm install, але можна повторити)
npm exec -w backend -- prisma generate

# 2. Застосувати міграції — створює таблиці News і Lead
npm run db:deploy

# 3. Заповнити базу стартовими новинами (додає лише в порожню таблицю)
npm run db:seed
```

Перевірити вміст бази у браузері (необов'язково):

```bash
npm exec -w backend -- prisma studio
```

### Крок 6. Запустити проєкт

Потрібні **два термінали** (обидва — з кореня репозиторію).

Термінал 1 — бекенд (API):

```bash
npm run dev:server
```

Очікуваний вивід: `API: http://localhost:3001`

Термінал 2 — фронтенд:

```bash
npm run dev
```

### Крок 7. Перевірити, що все працює

| Що | Адреса |
|---|---|
| Сайт | http://localhost:5173 |
| Адмін-панель (пароль = `ADMIN_PASSWORD`) | http://localhost:5173/admin |
| API напряму — список новин (JSON) | http://localhost:3001/api/news |

У dev-режимі Vite проксює всі запити `/api/*` на `http://localhost:3001`,
тому бекенд має бути запущений, інакше сайт покаже «Немає зв'язку із сервером».

---

## Коротко: усі команди підряд

```bash
git clone <URL-репозиторію> Senator && cd Senator
npm install
cp backend/.env.example backend/.env    # заповнити DATABASE_URL і ADMIN_PASSWORD
npm run db:deploy
npm run db:seed
npm run dev:server                      # термінал 1
npm run dev                             # термінал 2
```

## Усі скрипти

Запускаються з кореня репозиторію:

| Команда | Що робить |
|---|---|
| `npm install` | Встановлює залежності обох частин і генерує Prisma Client |
| `npm run dev` | Фронтенд у dev-режимі (Vite, http://localhost:5173) |
| `npm run dev:server` | Бекенд у dev-режимі з автоперезапуском (http://localhost:3001) |
| `npm run build` | Продакшн-збірка фронтенду в `frontend/dist` |
| `npm start` | Продакшн-запуск API (`NODE_ENV=production`) |
| `npm run lint` | ESLint для обох частин |
| `npm run db:deploy` | Застосувати міграції Prisma (`prisma migrate deploy`) |
| `npm run db:seed` | Заповнити базу стартовими новинами (`prisma db seed`) |

Скрипт конкретної частини: `npm run <script> -w frontend` або `npm run <script> -w backend`
(наприклад, `npm run preview -w frontend` — переглянути продакшн-збірку локально).

## API

| Метод | Шлях | Доступ | Опис |
|---|---|---|---|
| GET | `/api/news` | всі | Список новин |
| GET | `/api/news/:id` | всі | Одна новина |
| POST | `/api/news` | адмін | Створити новину |
| PUT | `/api/news/:id` | адмін | Оновити новину |
| DELETE | `/api/news/:id` | адмін | Видалити новину |
| POST | `/api/leads` | всі | Надіслати заявку (з rate limit) |
| GET | `/api/leads` | адмін | Список заявок |
| GET | `/api/leads/:id` | адмін | Одна заявка |
| PATCH | `/api/leads/:id` | адмін | Змінити статус заявки |
| DELETE | `/api/leads/:id` | адмін | Видалити заявку |
| GET | `/api/session` | всі | Чи авторизований адмін |
| POST | `/api/session` | всі | Вхід в адмінку (`{ "password": "..." }`) |
| DELETE | `/api/session` | всі | Вихід |

## Можливі проблеми

| Симптом | Рішення |
|---|---|
| `Cannot find module '.prisma/client'` / `@prisma/client did not initialize yet` | Виконати `npm exec -w backend -- prisma generate` |
| `The table "public.News" does not exist` | Не застосовані міграції — `npm run db:deploy` |
| `P1001: Can't reach database server` | Перевірити `DATABASE_URL`, що Postgres запущений (`docker ps`) |
| Міграція зависає на Neon | Використовується pooled-рядок — потрібен хост без `-pooler` або `DATABASE_URL_UNPOOLED` |
| На сайті «Немає зв'язку із сервером» | Не запущений бекенд (`npm run dev:server`) або він не на порту 3001 |
| Не вдається увійти в `/admin` | Не заданий `ADMIN_PASSWORD` у `backend/.env`; після зміни `.env` перезапустити бекенд |
| `--env-file-if-exists` / синтаксичні помилки при старті | Застара Node.js — потрібна 22.9+ |
| Порт 3001 або 5173 зайнятий | Зупинити інший процес або змінити `PORT` (тоді й проксі у `frontend/vite.config.js`) |

---

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
Після першого деплою один раз виконати `npm run db:seed` (або додати новини через адмінку).
Перевірка: `https://<адреса-бекенда>/api/news` повертає JSON.

### 2. Фронтенд — Vercel

1. У `frontend/vercel.json` замінити `YOUR-BACKEND-HOST` на адресу бекенда і закомітити.
2. На Vercel: Root Directory — `frontend`, Framework — Vite (решта за замовчуванням).

Vercel проксює `/api/*` на бекенд, тож для браузера це один домен:
CORS не потрібен, cookie адмінки працюють як є.
