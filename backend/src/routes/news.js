import express, { Router } from "express";
import * as newsController from "../controllers/newsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

// у новинах зберігаються стиснуті фото у вигляді data:-URL, тому ліміт більший
const jsonBody = express.json({ limit: "15mb" });

router.get("/", newsController.list);
router.get("/:id", newsController.getOne);
router.post("/", requireAdmin, jsonBody, newsController.create);
router.put("/:id", requireAdmin, jsonBody, newsController.update);
router.delete("/:id", requireAdmin, newsController.remove);

export default router;
