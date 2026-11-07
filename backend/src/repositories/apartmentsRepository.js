import { prisma } from "../lib/db.js";

export const findForSale = ({ rooms, areaFrom, areaTo }) =>
  prisma.apartment.findMany({
    where: {
      section: { status: "SELLING" },
      rooms,
      area: { gte: areaFrom, lte: areaTo },
    },
    orderBy: [{ area: "asc" }, { id: "asc" }],
    include: { section: { select: { price: true } } },
  });
