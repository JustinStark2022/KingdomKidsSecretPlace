import { Router } from "express";
import { verifyToken } from "@/middleware/auth.middleware";
import {
  getUserLessonsWithProgress, // <-- Use this!
  getUserLessonProgress,
  updateLessonProgress,
} from "@/controllers/lessons.controller";

const router = Router();
router.get("/", verifyToken, getUserLessonsWithProgress); 
router.get("/progress", verifyToken, getUserLessonProgress);
router.post("/progress", verifyToken, updateLessonProgress);

export default router;
