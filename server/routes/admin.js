import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../lib/db.js";
import {
  checkPassword,
  clearSession,
  isAuthenticated,
  requireAdmin,
  setSession,
} from "../lib/auth.js";
import { idSchema, leadStatusSchema, loginSchema, newsSchema } from "../lib/schemas.js";
import { serializeNews } from "./news.js";

const router = Router();

// у новинах зберігаються стиснуті фото у вигляді data:-URL, тому ліміт більший
router.use(express.json({ limit: "15mb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато спроб входу. Спробуйте пізніше." },
});

router.post("/login", loginLimiter, (req, res) => {
  const { password } = loginSchema.parse(req.body);
  if (!checkPassword(password)) return res.status(401).json({ error: "Невірний пароль" });
  setSession(res);
  res.json({ ok: true });
});

router.post("/logout", (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

router.get("/me", (req, res) => res.json({ authenticated: isAuthenticated(req) }));

router.use(requireAdmin);

const toNewsData = ({ date, ...rest }) => ({ ...rest, date: new Date(`${date}T00:00:00.000Z`) });

router.post("/news", async (req, res) => {
  const article = await prisma.news.create({ data: toNewsData(newsSchema.parse(req.body)) });
  res.status(201).json(serializeNews(article));
});

router.put("/news/:id", async (req, res) => {
  const article = await prisma.news.update({
    where: { id: idSchema.parse(req.params.id) },
    data: toNewsData(newsSchema.parse(req.body)),
  });
  res.json(serializeNews(article));
});

router.delete("/news/:id", async (req, res) => {
  await prisma.news.delete({ where: { id: idSchema.parse(req.params.id) } });
  res.json({ ok: true });
});

router.get("/leads", async (req, res) => {
  res.json(await prisma.lead.findMany({ orderBy: { createdAt: "desc" } }));
});

router.patch("/leads/:id", async (req, res) => {
  res.json(
    await prisma.lead.update({
      where: { id: idSchema.parse(req.params.id) },
      data: leadStatusSchema.parse(req.body),
    }),
  );
});

router.delete("/leads/:id", async (req, res) => {
  await prisma.lead.delete({ where: { id: idSchema.parse(req.params.id) } });
  res.json({ ok: true });
});

export default router;
