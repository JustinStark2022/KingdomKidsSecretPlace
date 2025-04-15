import express from 'express';
import { getMonitoredGames, blockGameById } from '../controllers/games.controller.js';

const router = express.Router();

router.get('/getMonitoredGames', getMonitoredGames);
router.get('/blockGameById', blockGameById);

export default router;
