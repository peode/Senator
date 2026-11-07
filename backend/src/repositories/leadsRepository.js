import { prisma } from "../lib/db.js";

export const findAll = () => prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

export const findByIdOrThrow = (id) => prisma.lead.findUniqueOrThrow({ where: { id } });

export const create = (data) => prisma.lead.create({ data });

export const update = (id, data) => prisma.lead.update({ where: { id }, data });

export const remove = (id) => prisma.lead.delete({ where: { id } });
