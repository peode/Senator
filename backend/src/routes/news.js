import express, { Router } from "express";
import { prisma } from "../lib/db.js";
import { requireAdmin } from "../lib/auth.js";
import { idSchema, newsSchema } from "../lib/schemas.js";

export const serializeNews = ({ date, createdAt, updatedAt, ...rest }) => ({
  ...rest,
  date: date.toISOString().slice(0, 10),
});

const toNewsData = ({ date, ...rest }) => ({ ...rest, date: new Date(`${date}T00:00:00.000Z`) });

const router = Router();

// у новинах зберігаються стиснуті фото у вигляді data:-URL, тому ліміт більший
const jsonBody = express.json({ limit: "15mb" });

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

router.post("/", requireAdmin, jsonBody, async (req, res) => {
  const article = await prisma.news.create({ data: toNewsData(newsSchema.parse(req.body)) });
  res.status(201).location(`${req.baseUrl}/${article.id}`).json(serializeNews(article));
});

router.put("/:id", requireAdmin, jsonBody, async (req, res) => {
  const article = await prisma.news.update({
    where: { id: idSchema.parse(req.params.id) },
    data: toNewsData(newsSchema.parse(req.body)),
  });
  res.json(serializeNews(article));
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.news.delete({ where: { id: idSchema.parse(req.params.id) } });
  res.status(204).end();
});

export default router;
