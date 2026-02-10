import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { 
  saveResult, 
  getUserResults, 
  deleteResult 
} from "../controllers/result.controller.js";

const router = Router();

// All routes require authentication
router.post("/", requireAuth, saveResult);           // POST /results - Save a new result
router.get("/", requireAuth, getUserResults);        // GET /results - Get user's results
router.delete("/:id", requireAuth, deleteResult);    // DELETE /results/:id - Delete a result

export default router;