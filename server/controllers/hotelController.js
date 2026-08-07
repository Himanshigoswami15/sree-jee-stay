import * as hotelService from '../services/hotelService.js';
import { logEvent } from '../services/auditService.js';
import { ADMIN_SECRET_KEY } from '../config/constants.js';

export async function onboard(req, res, next) {
  try {
    const secretKey = req.body.secretKey || req.headers['x-admin-secret-key'];
    const isSuperAdmin = req.user && req.user.role === 'SUPER_ADMIN';
    const expectedKey = process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY;

    if (!isSuperAdmin && secretKey !== expectedKey) {
      logEvent('SYSTEM', 'ONBOARDING_FAILED', {
        reason: 'Invalid secret key or unauthorized role',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }).catch(() => {});

      return res.status(403).json({
        success: false,
        message: 'Forbidden: Invalid Admin Secret Key or insufficient SUPER_ADMIN permissions.',
      });
    }

    const result = await hotelService.onboardHotel(req.body);

    logEvent(result.hotelId || result.hotelSlug || 'NEW_HOTEL', 'HOTEL_ONBOARDED', {
      hotelName: result.name || result.hotelName,
      superAdmin: req.user?.email || 'AdminSecretKey',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    }).catch(() => {});

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const hotels = await hotelService.getAllHotels();
    return res.status(200).json({ success: true, hotels });
  } catch (err) {
    next(err);
  }
}
