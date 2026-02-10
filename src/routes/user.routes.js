import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/user.validators.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const router = Router();
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, validateBody(updateProfileSchema), updateProfile);

export default router;
