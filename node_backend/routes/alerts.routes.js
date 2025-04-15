import express from 'express';
import { getAlerts, handleAlertAction } from '../controllers/alerts.controller.js';

const router = express.Router();

// GET /api/alerts
router.get('/', getAlerts);

// POST /api/alerts/:id/action
router.post('/:id/action', handleAlertAction);

export default router;
