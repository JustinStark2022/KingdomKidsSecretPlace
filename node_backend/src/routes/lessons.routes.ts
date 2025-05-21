import { Router } from "express";
import { verifyToken } from "@/middleware/auth.middleware";
import {
  getUserLessonsWithProgress,
  getUserLessonProgress,
  updateLessonProgress,
  assignLessonToChild, // <-- Import the new controller
} from "@/controllers/lessons.controller";

const router = Router();

router.get("/", verifyToken, getUserLessonsWithProgress);
router.get("/progress", verifyToken, getUserLessonProgress);
router.post("/progress", verifyToken, updateLessonProgress);

// Assign a lesson to a child (parent only)
router.post("/:lessonId/assign", verifyToken, assignLessonToChild);

export default router;
