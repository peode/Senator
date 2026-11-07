import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
import * as leadsController from "../controllers/leadsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

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
router.post("/", limiter, jsonBody, leadsController.create);
router.get("/", requireAdmin, leadsController.list);
router.get("/:id", requireAdmin, leadsController.getOne);
router.patch("/:id", requireAdmin, jsonBody, leadsController.updateStatus);
router.delete("/:id", requireAdmin, leadsController.remove);

export default router;
