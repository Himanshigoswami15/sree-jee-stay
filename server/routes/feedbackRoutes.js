import express from 'express';
import * as feedbackController from '../controllers/feedbackController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { submitFeedbackSchema, resolveFeedbackSchema } from '../validators/feedbackSchemas.js';
import { checkDuplicateSchema } from '../validators/hotelSchemas.js';

const router = express.Router();

router.post('/', validate(submitFeedbackSchema, 'body'), feedbackController.submit);

router.get('/check-duplicate', validate(checkDuplicateSchema, 'query'), feedbackController.checkDuplicate);

router.get('/', optionalAuth, feedbackController.list);
router.post('/:id/resolve', authenticate, validate(resolveFeedbackSchema, 'body'), feedbackController.resolve);

export default router;
