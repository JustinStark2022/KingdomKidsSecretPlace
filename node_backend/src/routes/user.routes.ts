// src/routes/user.routes.ts
import { Router } from "express";
import { getUser, getChildren, createChild } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Protect all user routes with verifyToken
router.get("/",         verifyToken, getUser);
router.get("/children", verifyToken, getChildren);
router.post("/child",   verifyToken, createChild);

export default router;
