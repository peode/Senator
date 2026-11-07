import { createPrisma } from "../src/lib/db.js";
import { defaultApartments, defaultSections, defaultSettings } from "./catalog.js";
import { defaultNews } from "./news.js";

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

// skipDuplicates і upsert без update: повторний запуск не затирає змінене в адмінці
await prisma.section.createMany({ data: defaultSections, skipDuplicates: true });
await prisma.apartment.createMany({ data: defaultApartments, skipDuplicates: true });
await prisma.siteSettings.upsert({ where: { id: 1 }, create: defaultSettings, update: {} });
console.log(`Каталог: ${defaultSections.length} секцій, ${defaultApartments.length} квартир`);

await prisma.$disconnect();
