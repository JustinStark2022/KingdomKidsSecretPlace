import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/me
router.get('/me', getUserProfile);

export default router;
