import { Router } from "express";
import { getFriendRequests } from "@/controllers/friend.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

router.get("/friend-requests", verifyToken, getFriendRequests);

export default router;
