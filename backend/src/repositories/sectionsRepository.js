import { prisma } from "../lib/db.js";

const withApartments = { apartments: { orderBy: { id: "asc" } } };

export const findAll = () => prisma.section.findMany({ orderBy: { id: "asc" }, include: withApartments });

export const update = (id, data) =>
  prisma.section.update({ where: { id }, data, include: withApartments });
