import { Router } from "express";
import { getScreenTimeData, getScreenTimeForUser } from "../controllers/screenTime.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

router.get("/screen-time", verifyToken, getScreenTimeData);
router.get("/screen-time/:userId", verifyToken, getScreenTimeForUser);

export default router;
