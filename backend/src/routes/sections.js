import express, { Router } from "express";
import * as sectionsController from "../controllers/sectionsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", sectionsController.list);
router.patch("/:id", requireAdmin, express.json({ limit: "1kb" }), sectionsController.update);

export default router;
