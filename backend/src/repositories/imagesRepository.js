import { prisma } from "../lib/db.js";

// Зображення віддається окремим запитом: у списку воно зайве
export const findAll = () => prisma.siteImage.findMany({ omit: { image: true } });

export const findImage = (key) => prisma.siteImage.findUnique({ where: { key }, select: { image: true } });

export const upsert = (key, data) =>
  prisma.siteImage.upsert({
    where: { key },
    create: { key, ...data },
    update: data,
    omit: { image: true },
  });

export const remove = (key) => prisma.siteImage.deleteMany({ where: { key } });
