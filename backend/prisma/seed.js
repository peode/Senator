import { readFile } from "node:fs/promises";
import { createPrisma } from "../src/lib/db.js";
import { defaultApartments, defaultPlans, defaultSections, defaultSettings } from "./catalog.js";
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
// Лише секціям без плану: інакше повернулися б квартири, видалені разом зі старим планом
for (const { sectionId, file, width, height } of defaultPlans) {
  const { count } = await prisma.section.updateMany({
    where: { id: sectionId, planImage: null },
    data: {
      planImage: await readFile(new URL(`./plans/${file}`, import.meta.url)),
      planWidth: width,
      planHeight: height,
    },
  });
  if (count > 0) {
    await prisma.apartment.createMany({
      data: defaultApartments.filter((apartment) => apartment.sectionId === sectionId),
      skipDuplicates: true,
    });
  }
}
const sections = await prisma.section.findMany({ include: { apartments: true } });
await prisma.apartmentUnit.createMany({
  data: sections.flatMap(({ apartments, floors }) =>
    apartments.flatMap(({ id }) =>
      Array.from({ length: floors }, (_, index) => ({ apartmentId: id, floor: index + 1 })),
    ),
  ),
  skipDuplicates: true,
});
await prisma.siteSettings.upsert({ where: { id: 1 }, create: defaultSettings, update: {} });
console.log(`Каталог: ${defaultSections.length} секцій, ${defaultApartments.length} планувань`);

await prisma.$disconnect();
