import { Router } from "express";
import { getAlerts } from "@/controllers/alert.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

router.get("/recent", verifyToken, getAlerts);

export default router;
