import express from "express";
import { fetchUniversityNews, listNews } from "../controllers/news.controller.js";

const router = express.Router();

router.get("/", listNews);
router.post("/fetch/:universityId", fetchUniversityNews);

export default router;
