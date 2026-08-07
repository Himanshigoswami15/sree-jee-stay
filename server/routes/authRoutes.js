import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { loginSchema, changePasswordSchema } from '../validators/authSchemas.js';
import { refreshTokenSchema } from '../validators/hotelSchemas.js';

const router = express.Router();

router.post('/login', rateLimiter(15 * 60 * 1000, 10), validate(loginSchema, 'body'), authController.login);
router.post('/super-login', rateLimiter(15 * 60 * 1000, 5), authController.superAdminLogin);
router.post('/verify', rateLimiter(15 * 60 * 1000, 10), validate(loginSchema, 'body'), authController.login);
router.post('/change-password', authenticate, validate(changePasswordSchema, 'body'), authController.changePassword);
router.post('/refresh', validate(refreshTokenSchema, 'body'), authController.refresh);
router.get('/status', authController.status);
router.get('/me', optionalAuth, authController.me);
router.post('/logout', authController.logout);

export default router;
