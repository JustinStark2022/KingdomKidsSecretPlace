import { Router } from "express";
import { getFlaggedChatMessages } from "@/controllers/chat.controller";
import { verifyToken } from "@/middleware/auth.middleware";

const router = Router();

router.get("/chat/flagged", verifyToken, getFlaggedChatMessages);

export default router;
