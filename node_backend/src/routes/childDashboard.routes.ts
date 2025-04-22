// src/routes/childDashboard.routes.ts
import { Router } from "express";
import { getChildDashboardData } from "@/controllers/childDashboard.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

// GET /api/child-dashboard
router.get("/", verifyToken, getChildDashboardData);

export default router;
