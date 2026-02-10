import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { listPrograms, createProgram } from "../controllers/program.controller.js";

const router = Router();
router.get("/", listPrograms);
router.post("/", requireAuth, requireRole("admin"), createProgram);

export default router;
