import { Router } from "express";
import { prisma } from "../lib/db.js";
import { idSchema } from "../lib/schemas.js";

export const serializeNews = ({ date, createdAt, updatedAt, ...rest }) => ({
  ...rest,
  date: date.toISOString().slice(0, 10),
});

const router = Router();

router.get("/", async (req, res) => {
  const news = await prisma.news.findMany({ orderBy: [{ date: "desc" }, { id: "desc" }] });
  res.json(news.map(serializeNews));
});

router.get("/:id", async (req, res) => {
  const id = idSchema.safeParse(req.params.id);
  const article = id.success && (await prisma.news.findUnique({ where: { id: id.data } }));
  if (!article) return res.status(404).json({ error: "Новину не знайдено" });
  res.json(serializeNews(article));
});

export default router;
