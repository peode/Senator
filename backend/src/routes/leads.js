import { Router } from "express";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../lib/db.js";
import { leadSchema } from "../lib/schemas.js";
import { notifyNewLead } from "../lib/telegram.js";

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато заявок. Спробуйте пізніше або зателефонуйте нам." },
});

router.post("/", limiter, express.json({ limit: "10kb" }), async (req, res) => {
  const { website, ...data } = leadSchema.parse(req.body);
  // бот заповнив приманку — вдаємо успіх, але не зберігаємо
  if (!website) {
    const lead = await prisma.lead.create({ data });
    // await потрібен: на serverless функцію можуть зупинити одразу після відповіді
    await notifyNewLead(lead);
  }
  res.status(201).json({ ok: true });
});

export default router;
