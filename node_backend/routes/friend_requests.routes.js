import express from 'express';
import { getFriendRequests, approveFriendRequest, declineFriendRequest } from '../controllers/friend_requests.controller.js';

const router = express.Router();

router.get('/getFriendRequests', getFriendRequests);
router.get('/approveFriendRequest', approveFriendRequest);
router.get('/declineFriendRequest', declineFriendRequest);

export default router;
