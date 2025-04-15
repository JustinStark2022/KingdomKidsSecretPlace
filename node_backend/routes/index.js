import express from 'express';
import alertsRoutes from './alerts.routes.js';
import authRoutes from './auth.routes.js';
import bibleRoutes from './bible.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import devotionalsRoutes from './devotionals.routes.js';
import friendRequestsRoutes from './friend_requests.routes.js';
import gamesRoutes from './games.routes.js';
import lessonsRoutes from './lessons.routes.js';
import monitoringRoutes from './monitoring.routes.js';
import notificationsRoutes from './notifications.routes.js';
import prayerRoutes from './prayer.routes.js';
import settingsRoutes from './settings.routes.js';
import usersRoutes from './users.routes.js';

const router = express.Router();

// Mount each route under /api/<name>
router.use('/alerts', alertsRoutes);
router.use('/auth', authRoutes);
router.use('/bible', bibleRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/devotionals', devotionalsRoutes);
router.use('/friend-requests', friendRequestsRoutes);
router.use('/games', gamesRoutes);
router.use('/lessons', lessonsRoutes);
router.use('/monitoring', monitoringRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/prayer', prayerRoutes);
router.use('/settings', settingsRoutes);
router.use('/users', usersRoutes);

// Health check route
router.get('/status', (_req, res) => {
  res.json({ status: 'API is running' });
});

export default router;