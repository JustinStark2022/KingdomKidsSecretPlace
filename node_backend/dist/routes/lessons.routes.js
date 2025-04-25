import { Router } from "express";
import { verifyToken } from "@/middleware/auth.middleware";
import { getBibleLessons, getUserLessonProgress, updateLessonProgress, } from "@/controllers/lessons.controller";
// Example in routes file
const router = Router();
// router.get("/protected-route", verifyToken, controllerFunction); // Removed or commented out due to undefined controllerFunction
router.get("/lessons", verifyToken, getBibleLessons);
router.get("/lessons/progress", verifyToken, getUserLessonProgress);
router.post("/lessons/progress", verifyToken, updateLessonProgress);
export default router;
