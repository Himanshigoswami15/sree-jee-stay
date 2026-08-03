import express from 'express';
import * as qrController from '../controllers/qrController.js';

const router = express.Router();

router.post('/generate-qr', qrController.generateQr);
router.get('/analytics', qrController.getAnalytics);
router.get('/download/png', qrController.downloadPng);
router.get('/download/pdf', qrController.downloadPdf);
router.get('/r/:token', qrController.resolveScan);

export default router;
