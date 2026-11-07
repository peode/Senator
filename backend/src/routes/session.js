import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as sessionController from "../controllers/sessionController.js";

// Сесія адміністратора як ресурс: GET — поточна, POST — увійти, DELETE — вийти
const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Забагато спроб входу. Спробуйте пізніше." },
});

router.get("/", sessionController.current);
router.post("/", loginLimiter, express.json({ limit: "1kb" }), sessionController.login);
router.delete("/", sessionController.logout);

export default router;
