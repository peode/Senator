import { prisma } from "../lib/db.js";

export const findForSale = ({ rooms, areaFrom, areaTo }) =>
  prisma.apartmentUnit.findMany({
    where: {
      available: true,
      apartment: {
        section: { status: "SELLING" },
        rooms,
        area: { gte: areaFrom, lte: areaTo },
      },
    },
    orderBy: [{ apartment: { area: "asc" } }, { apartmentId: "asc" }, { floor: "asc" }],
    include: { apartment: { include: { section: { select: { price: true } } } } },
  });

export const updateUnit = (id, data) =>
  prisma.apartmentUnit.update({
    where: { id },
    data,
    select: { id: true, floor: true, available: true },
  });
