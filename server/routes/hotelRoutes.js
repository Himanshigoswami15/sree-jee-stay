import express from 'express';
import * as hotelController from '../controllers/hotelController.js';
import { validate } from '../middleware/validate.js';
import { onboardHotelSchema } from '../validators/hotelSchemas.js';

const router = express.Router();

router.get('/', hotelController.list);
router.post('/onboard', validate(onboardHotelSchema, 'body'), hotelController.onboard);

export default router;
