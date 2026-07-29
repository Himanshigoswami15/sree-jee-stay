import express from 'express';
import authRoutes from './authRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import keywordRoutes from './keywordRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import auditRoutes from './auditRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import qrRoutes from './qrRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/settings', settingsRoutes);
router.use('/keywords', keywordRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit', auditRoutes);
router.use('/hotels', hotelRoutes);
router.use('/review', qrRoutes);

export default router;
