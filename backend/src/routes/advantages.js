import express, { Router } from "express";
import * as advantagesController from "../controllers/advantagesController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

// власне фото приходить стиснутим у вигляді data:-URL, тому ліміт більший
const jsonBody = express.json({ limit: "5mb" });

router.get("/", advantagesController.list);
router.post("/", requireAdmin, jsonBody, advantagesController.create);
router.put("/order", requireAdmin, jsonBody, advantagesController.reorder);
router.put("/:id", requireAdmin, jsonBody, advantagesController.update);
router.delete("/:id", requireAdmin, advantagesController.remove);

export default router;
