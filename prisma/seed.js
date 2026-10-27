import { createPrisma } from "../server/lib/db.js";
import { defaultNews } from "../src/data/news.js";

try {
  process.loadEnvFile();
} catch {
  // .env немає — змінні задані середовищем
}

const prisma = createPrisma();

// Додає стартові новини лише в порожню таблицю, щоб не затирати відредаговане в адмінці
if ((await prisma.news.count()) === 0) {
  await prisma.news.createMany({
    data: defaultNews.map(({ id, date, ...rest }) => ({ ...rest, date: new Date(`${date}T00:00:00.000Z`) })),
  });
  console.log(`Додано новин: ${defaultNews.length}`);
} else {
  console.log("Новини вже є — пропускаю");
}

await prisma.$disconnect();
