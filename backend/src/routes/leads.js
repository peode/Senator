import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../lib/db.js";
import { requireAdmin } from "../lib/auth.js";
import { idSchema, leadSchema, leadStatusSchema } from "../lib/schemas.js";
import { notifyNewLead } from "../lib/telegram.js";

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато заявок. Спробуйте пізніше або зателефонуйте нам." },
});

const jsonBody = express.json({ limit: "10kb" });

// створити заявку може будь-хто, решта — лише адміністратор
router.post("/", limiter, jsonBody, async (req, res) => {
  const { website, ...data } = leadSchema.parse(req.body);
  // бот заповнив приманку — вдаємо успіх, але не зберігаємо
  if (!website) {
    const lead = await prisma.lead.create({ data });
    // await потрібен: на serverless функцію можуть зупинити одразу після відповіді
    await notifyNewLead(lead);
  }
  res.status(201).json({ ok: true });
});

router.get("/", requireAdmin, async (req, res) => {
  res.json(await prisma.lead.findMany({ orderBy: { createdAt: "desc" } }));
});

router.get("/:id", requireAdmin, async (req, res) => {
  res.json(await prisma.lead.findUniqueOrThrow({ where: { id: idSchema.parse(req.params.id) } }));
});

router.patch("/:id", requireAdmin, jsonBody, async (req, res) => {
  res.json(
    await prisma.lead.update({
      where: { id: idSchema.parse(req.params.id) },
      data: leadStatusSchema.parse(req.body),
    }),
  );
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.lead.delete({ where: { id: idSchema.parse(req.params.id) } });
  res.status(204).end();
});

export default router;
