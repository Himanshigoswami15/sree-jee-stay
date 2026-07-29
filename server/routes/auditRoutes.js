import express from 'express';
import * as auditController from '../controllers/auditController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { auditLogSchema } from '../validators/hotelSchemas.js';

const router = express.Router();

router.post('/', validate(auditLogSchema, 'body'), auditController.create);
router.get('/', authenticate, auditController.list);

export default router;
