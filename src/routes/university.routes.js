import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { listUniversities, createUniversity } from "../controllers/university.controller.js";

const router = Router();
router.get("/", listUniversities);
router.post("/", requireAuth, requireRole("admin"), createUniversity);

export default router;
