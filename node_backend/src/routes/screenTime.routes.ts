import { Router } from "express";
import { getScreenTimeForUser, updateScreenTime } from "../controllers/screenTime.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

// GET /api/screentime?userId=...
router.get("/", verifyToken, getScreenTimeForUser);

// POST /api/screentime/update
router.post("/update", verifyToken, updateScreenTime);

export default router;
