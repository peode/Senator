import { defineConfig } from "prisma/config";

try {
  process.loadEnvFile();
} catch {
  // .env немає — змінні можуть бути задані середовищем (хостингом)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    // міграціям потрібне пряме підключення: Neon-хост без "-pooler" (advisory lock не працює через pooler)
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL?.replace("-pooler", ""),
  },
});
