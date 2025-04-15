import express from 'express';
import { getUsers, getUserById } from '../controllers/users.controller.js';

const router = express.Router();

router.get('/getUsers', getUsers);
router.get('/getUserById', getUserById);

export default router;