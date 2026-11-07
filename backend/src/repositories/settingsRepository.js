import { prisma } from "../lib/db.js";

const SETTINGS_ID = 1;

export const find = () => prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });

export const save = (data) =>
  prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
