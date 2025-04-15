import express from 'express';
import { getDevotionals, createDevotional } from '../controllers/devotionals.controller.js';

const router = express.Router();

router.get('/getDevotionals', getDevotionals);
router.get('/createDevotional', createDevotional);

export default router;
