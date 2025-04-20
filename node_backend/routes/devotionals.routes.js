import express from 'express';
import { getDevotionals, createDevotional } from '../controllers/devotionals.controller.js';

const router = express.Router();

// ✅ Matches GET /api/devotionals exactly
router.get("/", getDevotionals);

// Optional: switch to POST later if you accept form data
router.post("/", createDevotional);

export default router;