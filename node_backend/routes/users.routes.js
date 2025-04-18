import express from 'express';
import {
  getUsers,
  getUserById,
  createChildAccount,
  getCurrentUser,
  getChildrenForParent
} from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔓 Public Routes
router.get('/getUsers', getUsers);
router.get('/getUserById', getUserById);

// 🔐 Protected Routes
router.get("/me", requireAuth, getCurrentUser); // ✅ Returns logged-in user
router.post("/create-child", requireAuth, createChildAccount); // ✅ Parents create children
router.get("/children", requireAuth, getChildrenForParent); // ✅ Get children for current parent

export default router;
