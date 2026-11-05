import express, { Router } from "express";
import * as sectionsController from "../controllers/sectionsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", sectionsController.list);
router.put("/map", requireAdmin, express.json({ limit: "4mb" }), sectionsController.updateMap);
router.patch("/:id", requireAdmin, express.json({ limit: "1kb" }), sectionsController.update);
router.get("/:id/plan", sectionsController.planImage);
router.get("/:id/mobile-plan", sectionsController.mobilePlanImage);
router.put("/:id/plan", requireAdmin, express.json({ limit: "8mb" }), sectionsController.updatePlan);

export default router;
