import express, { Router } from "express";
import * as apartmentsController from "../controllers/apartmentsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", apartmentsController.list);
router.patch("/:id", requireAdmin, express.json({ limit: "1kb" }), apartmentsController.update);

export default router;
