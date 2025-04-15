import express from 'express';
import { getMonitoringOverview, getFlaggedContent } from '../controllers/monitoring.controller.js';

const router = express.Router();

router.get('/getMonitoringOverview', getMonitoringOverview);
router.get('/getFlaggedContent', getFlaggedContent);

export default router;
