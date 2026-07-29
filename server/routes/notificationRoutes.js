import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, notificationController.list);
router.post('/:id/read', authenticate, notificationController.markRead);

export default router;
