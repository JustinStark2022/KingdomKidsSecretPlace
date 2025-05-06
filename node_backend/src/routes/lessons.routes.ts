import { Router } from "express";
import { verifyToken } from "@/middleware/auth.middleware";
import {
  getBibleLessons,
  getUserLessonProgress,
  updateLessonProgress,
} from "@/controllers/lessons.controller";
// Example in routes file


const router = Router();
// router.get("/protected-route", verifyToken, controllerFunction); // Removed or commented out due to undefined controllerFunction
router.get("/", verifyToken, getBibleLessons);
router.get("/progress", verifyToken, getUserLessonProgress);
router.post("/progress", verifyToken, updateLessonProgress);

export default router;
