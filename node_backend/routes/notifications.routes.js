import express from 'express';
import {
  getUnreadNotifications,
  markNotificationsRead
} from '../controllers/notifications.controller.js';

const router = express.Router();

// GET /api/notifications/unread
router.get('/unread', getUnreadNotifications);

// POST /api/notifications/read
router.post('/read', markNotificationsRead);

export default router;
