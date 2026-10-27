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
    url: process.env.DATABASE_URL,
  },
});
