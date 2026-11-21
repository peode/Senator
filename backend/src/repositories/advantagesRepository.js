import { prisma } from "../lib/db.js";

export const findAll = () => prisma.advantage.findMany({ orderBy: [{ position: "asc" }, { id: "asc" }] });

export const nextPosition = async (placement) => {
  const { _max } = await prisma.advantage.aggregate({ where: { placement }, _max: { position: true } });
  return (_max.position ?? -1) + 1;
};

export const create = (data) => prisma.advantage.create({ data });

export const update = (id, data) => prisma.advantage.update({ where: { id }, data });

export const remove = (id) => prisma.advantage.delete({ where: { id } });

export const reorder = (ids) =>
  prisma.$transaction(
    ids.map((id, position) => prisma.advantage.update({ where: { id }, data: { position } })),
  );
