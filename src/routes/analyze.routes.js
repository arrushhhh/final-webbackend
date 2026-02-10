import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createResultSchema } from "../validators/result.validators.js";
import { analyze } from "../controllers/analyze.controller.js";

const router = Router();
router.post("/", requireAuth, validateBody(createResultSchema), analyze);
export default router;
