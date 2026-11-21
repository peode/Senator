import { Prisma } from "@prisma/client";
import { COMPLEX_MAP_KEY } from "../lib/imageData.js";
import { prisma } from "../lib/db.js";

// Зображення плану віддається окремим запитом: у списку секцій воно зайве
const withApartments = {
  omit: { planImage: true },
  include: {
    apartments: {
      orderBy: { id: "asc" },
      include: { units: { orderBy: { floor: "asc" } } },
    },
  },
};

const unitsOf = (apartmentId, floors) =>
  Array.from({ length: floors }, (_, index) => ({ apartmentId, floor: index + 1 }));

export const findAll = () => prisma.section.findMany({ orderBy: { id: "asc" }, ...withApartments });

export const findPlanImage = (id) =>
  prisma.section.findUniqueOrThrow({ where: { id }, select: { planImage: true } });

// Квартири мають відповідати кількості поверхів: зайві видаляємо, нові додаємо в наявності
export const update = (id, data) =>
  prisma.$transaction(async (tx) => {
    const { apartments } = await tx.section.update({
      where: { id },
      data,
      select: { apartments: { select: { id: true } } },
    });

    await tx.apartmentUnit.deleteMany({
      where: { apartment: { sectionId: id }, floor: { gt: data.floors } },
    });
    await tx.apartmentUnit.createMany({
      data: apartments.flatMap(({ id: apartmentId }) => unitsOf(apartmentId, data.floors)),
      skipDuplicates: true,
    });

    return tx.section.findUniqueOrThrow({ where: { id }, ...withApartments });
  });

// План зберігається цілком: чого немає в списку — видаляємо, id не з цієї секції — нові квартири.
// Наявні квартири лишаються зі своїм статусом продажу
export const updatePlan = (id, { plan, apartments }) =>
  prisma.$transaction(
    async (tx) => {
      const section = await tx.section.findUniqueOrThrow({
        where: { id },
        select: { floors: true, apartments: { select: { id: true } } },
      });
      const existing = new Set(section.apartments.map((apartment) => apartment.id));
      const kept = apartments.filter((apartment) => existing.has(apartment.id));
      const added = apartments.filter((apartment) => !existing.has(apartment.id));

      if (plan) {
        await tx.section.update({
          where: { id },
          data: { planImage: plan.image, planWidth: plan.width, planHeight: plan.height },
        });
      }
      await tx.apartment.deleteMany({
        where: { sectionId: id, id: { notIn: kept.map((apartment) => apartment.id) } },
      });
      for (const { id: apartmentId, ...data } of kept) {
        await tx.apartment.update({ where: { id: apartmentId }, data });
      }

      const lastNumber = Math.max(0, ...kept.map((apartment) => Number(apartment.id.split("-")[1])));
      const created = added.map(({ id: _id, ...data }, index) => ({
        ...data,
        id: `${id}-${lastNumber + index + 1}`,
        sectionId: id,
      }));
      await tx.apartment.createMany({ data: created });
      await tx.apartmentUnit.createMany({
        data: created.flatMap((apartment) => unitsOf(apartment.id, section.floors)),
      });

      return tx.section.findUniqueOrThrow({ where: { id }, ...withApartments });
    },
    // кожна квартира — окремий запит, а до бази в хмарі кожен іде довго
    { timeout: 20_000 },
  );

// Секції, яких немає в списку, зникають з карти, але самі лишаються зі своїми квартирами
export const updateMap = ({ map, zones }) =>
  prisma.$transaction(
    async (tx) => {
      if (map) {
        await tx.siteImage.upsert({
          where: { key: COMPLEX_MAP_KEY },
          create: { key: COMPLEX_MAP_KEY, ...map },
          update: map,
        });
      }
      await tx.section.updateMany({
        where: { id: { notIn: zones.map((zone) => zone.id) } },
        data: { mapPoints: Prisma.DbNull },
      });
      for (const { id, points } of zones) {
        await tx.section.update({ where: { id }, data: { mapPoints: points } });
      }
    },
    // кожна секція — окремий запит, а до бази в хмарі кожен іде довго
    { timeout: 20_000 },
  );
