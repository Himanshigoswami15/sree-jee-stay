import * as hotelService from '../services/hotelService.js';
import { logEvent } from '../services/auditService.js';
import { ADMIN_SECRET_KEY } from '../config/constants.js';

export async function onboard(req, res, next) {
  try {
    const providedKey = (req.body.secretKey || req.body.adminSecretKey || req.headers['x-admin-secret-key'] || '').toString().trim();
    const isSuperAdmin = req.user && req.user.role === 'SUPER_ADMIN';
    const expectedKey = (process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY || 'JJR-2026-SUPER-6X8F91ZP-K29A').toString().trim();

    if (!isSuperAdmin && (!providedKey || providedKey !== expectedKey)) {
      logEvent('SYSTEM', 'ONBOARDING_FAILED', {
        reason: 'Invalid secret key or unauthorized role',
        providedKeyLength: providedKey ? providedKey.length : 0,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }).catch(() => {});

      return res.status(403).json({
        success: false,
        error: 'Invalid Admin Secret Key. Please enter the correct key.',
        message: 'Invalid Admin Secret Key. Please enter the correct key.',
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
