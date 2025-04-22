import { Router } from "express";
import { getScreenTimeData } from "../controllers/screenTime.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

router.get("/screen-time", verifyToken, getScreenTimeData);

export default router;
