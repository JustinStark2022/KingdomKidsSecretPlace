import { Router } from "express";
import { registerUser, loginUser, logoutUser, } from "@/controllers/auth.controller";
const router = Router();
// public
router.post("/register", registerUser);
router.post("/login", loginUser);
// protected
router.post("/logout", logoutUser);
export default router;
