import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateSettingsSchema } from '../validators/settingsSchemas.js';

const router = express.Router();

router.get('/', settingsController.get);
router.put('/', optionalAuth, validate(updateSettingsSchema, 'body'), settingsController.update);
router.post('/', optionalAuth, validate(updateSettingsSchema, 'body'), settingsController.update);

export default router;
