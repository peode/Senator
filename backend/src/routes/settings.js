import express, { Router } from "express";
import * as settingsController from "../controllers/settingsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", settingsController.get);
router.put("/", requireAdmin, express.json({ limit: "10kb" }), settingsController.update);

export default router;
