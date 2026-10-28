import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { checkPassword, clearSession, isAuthenticated, setSession } from "../lib/auth.js";
import { loginSchema } from "../lib/schemas.js";

// Сесія адміністратора як ресурс: GET — поточна, POST — увійти, DELETE — вийти
const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато спроб входу. Спробуйте пізніше." },
});

router.get("/", (req, res) => res.json({ authenticated: isAuthenticated(req) }));

router.post("/", loginLimiter, express.json({ limit: "1kb" }), (req, res) => {
  const { password } = loginSchema.parse(req.body);
  if (!checkPassword(password)) return res.status(401).json({ error: "Невірний пароль" });
  setSession(res);
  res.status(201).json({ authenticated: true });
});

router.delete("/", (req, res) => {
  clearSession(res);
  res.status(204).end();
});

export default router;
