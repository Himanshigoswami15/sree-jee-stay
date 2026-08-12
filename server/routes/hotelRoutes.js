import express from 'express';
import * as hotelController from '../controllers/hotelController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { onboardHotelSchema } from '../validators/hotelSchemas.js';

const router = express.Router();

router.get('/', hotelController.list);
router.post(
  '/onboard',
  rateLimiter(15 * 60 * 1000, 5),
  optionalAuth,
  validate(onboardHotelSchema, 'body'),
  hotelController.onboard
);

router.delete(
  '/:hotelId',
  rateLimiter(15 * 60 * 1000, 5),
  optionalAuth,
  hotelController.deleteHotel
);

export default router;

