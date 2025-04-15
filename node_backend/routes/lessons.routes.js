import express from 'express';
import { getLessons, getLessonById } from '../controllers/lessons.controller.js';

const router = express.Router();

router.get('/getLessons', getLessons);
router.get('/getLessonById', getLessonById);

export default router;
