import express from 'express';
import { getPrayerEntries, addPrayerEntry } from '../controllers/prayer.controller.js';

const router = express.Router();

router.get('/getPrayerEntries', getPrayerEntries);
router.get('/addPrayerEntry', addPrayerEntry);

export default router;
