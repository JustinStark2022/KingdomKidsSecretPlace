import express from 'express';
import { getLessons, getLessonById } from '../controllers/lessons.controller.js';

const router = express.Router();

router.get('/', getLessons); // ✅ Matches GET /api/bible-lessons
router.get('/:id', getLessonById);

export default router;
