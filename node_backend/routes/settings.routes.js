import express from 'express';
import { getUserSettings, updateUserSettings } from '../controllers/settings.controller.js';

const router = express.Router();

router.get('/getUserSettings', getUserSettings);
router.get('/updateUserSettings', updateUserSettings);

export default router;
