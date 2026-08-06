import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateSettingsSchema } from '../validators/settingsSchemas.js';

const router = express.Router();

router.get('/', settingsController.get);
router.put('/', authenticate, validate(updateSettingsSchema, 'body'), settingsController.update);
router.post('/', authenticate, validate(updateSettingsSchema, 'body'), settingsController.update);
router.post('/reset', authenticate, settingsController.resetData);

export default router;
