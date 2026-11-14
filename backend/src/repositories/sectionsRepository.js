import { prisma } from "../lib/db.js";

const withApartments = {
  apartments: {
    orderBy: { id: "asc" },
    include: { units: { orderBy: { floor: "asc" } } },
  },
};

export const findAll = () => prisma.section.findMany({ orderBy: { id: "asc" }, include: withApartments });

// Квартири мають відповідати кількості поверхів: зайві видаляємо, нові додаємо в наявності
export const update = (id, data) =>
  prisma.$transaction(async (tx) => {
    const { apartments } = await tx.section.update({
      where: { id },
      data,
      include: { apartments: { select: { id: true } } },
    });

    await tx.apartmentUnit.deleteMany({
      where: { apartment: { sectionId: id }, floor: { gt: data.floors } },
    });
    await tx.apartmentUnit.createMany({
      data: apartments.flatMap(({ id: apartmentId }) =>
        Array.from({ length: data.floors }, (_, index) => ({ apartmentId, floor: index + 1 })),
      ),
      skipDuplicates: true,
    });

    return tx.section.findUniqueOrThrow({ where: { id }, include: withApartments });
  });
