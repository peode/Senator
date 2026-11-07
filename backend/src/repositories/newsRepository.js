import { prisma } from "../lib/db.js";

export const findAll = () => prisma.news.findMany({ orderBy: [{ date: "desc" }, { id: "desc" }] });

export const findById = (id) => prisma.news.findUnique({ where: { id } });

export const create = (data) => prisma.news.create({ data });

export const update = (id, data) => prisma.news.update({ where: { id }, data });

export const remove = (id) => prisma.news.delete({ where: { id } });
