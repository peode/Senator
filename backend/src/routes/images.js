import express, { Router } from "express";
import * as imagesController from "../controllers/imagesController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", imagesController.list);
router.get("/:key", imagesController.getOne);
router.put("/:key", requireAdmin, express.json({ limit: "4mb" }), imagesController.save);
router.delete("/:key", requireAdmin, imagesController.remove);

export default router;
