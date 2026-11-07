import { Router } from "express";
import * as apartmentsController from "../controllers/apartmentsController.js";

const router = Router();

router.get("/", apartmentsController.list);

export default router;
