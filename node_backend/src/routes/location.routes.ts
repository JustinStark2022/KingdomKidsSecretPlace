import { Router } from "express";
import { getUserLocation } from "@/controllers/location.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

router.get("/location", verifyToken, getUserLocation);

export default router;
