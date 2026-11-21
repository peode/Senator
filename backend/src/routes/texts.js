import express, { Router } from "express";
import * as textsController from "../controllers/textsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", textsController.list);
router.put("/", requireAdmin, express.json({ limit: "500kb" }), textsController.save);

export default router;
