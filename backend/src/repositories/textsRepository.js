import { prisma } from "../lib/db.js";

export const findAll = () => prisma.siteText.findMany({ select: { key: true, value: true } });

export const save = (changed, removed) =>
  prisma.$transaction(
    async (tx) => {
      await tx.siteText.deleteMany({ where: { key: { in: removed } } });
      for (const [key, value] of changed) {
        await tx.siteText.upsert({ where: { key }, create: { key, value }, update: { value } });
      }
    },
    // кожен текст — окремий запит, а до бази в хмарі кожен іде довго
    { timeout: 20_000 },
  );
