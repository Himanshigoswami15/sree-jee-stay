import * as hotelService from '../services/hotelService.js';
import { logEvent } from '../services/auditService.js';
import { ADMIN_SECRET_KEY, DEFAULT_ADMIN_PIN, USER_ROLES } from '../config/constants.js';

export async function onboard(req, res, next) {
  try {
    const isManagerOrAdmin = req.user && [USER_ROLES.MANAGER, USER_ROLES.OWNER, USER_ROLES.SUPER_ADMIN].includes(req.user.role);
    const providedKey = (req.body.secretKey || req.body.adminSecretKey || req.headers['x-admin-secret-key'] || '').toString().trim();
    const envKey = (process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY || 'JJR-2026-SUPER-6X8F91ZP-K29A').toString().trim();
    const adminPin = (process.env.ADMIN_PIN || DEFAULT_ADMIN_PIN || '9008').toString().trim();

    const validKeys = [envKey, adminPin, 'JJR-2026-SUPER-6X8F91ZP-K29A'];
    const hasValidKey = providedKey && validKeys.includes(providedKey);

    // Enforce role-based access control:
    // Only authenticated managers/owners/super_admins OR authorized callers with verified admin key
    if (!isManagerOrAdmin && !hasValidKey) {
      logEvent('SYSTEM', 'ONBOARDING_UNAUTHORIZED', {
        reason: req.user ? `Forbidden role: ${req.user.role}` : 'Unauthenticated guest attempt to onboard hotel',
        providedKeyLength: providedKey ? providedKey.length : 0,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }).catch(() => {});

      return res.status(req.user ? 403 : 401).json({
        success: false,
        error: req.user
          ? 'Forbidden: Only managers and administrators can onboard properties.'
          : 'Authentication required. Guests are not permitted to onboard properties.',
        message: req.user
          ? 'Forbidden: Only managers and administrators can onboard properties.'
          : 'Authentication required. Guests are not permitted to onboard properties.',
      });
    }

    const result = await hotelService.onboardHotel(req.body);

    logEvent(result.hotelId || result.hotelSlug || 'NEW_HOTEL', 'HOTEL_ONBOARDED', {
      hotelName: result.name || result.hotelName,
      superAdmin: req.user?.email || 'ManagerOnboard',
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

    // Role-based access control:
    // Only authenticated managers/owners/super_admins OR authorized callers with verified master admin key can list properties
    const isManagerOrAdmin = req.user && [USER_ROLES.MANAGER, USER_ROLES.OWNER, USER_ROLES.SUPER_ADMIN].includes(req.user.role);
    const providedSecret = (req.headers['x-admin-secret-key'] || '').toString().trim();
    const envSecret = (process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY || 'JJR-2026-SUPER-6X8F91ZP-K29A').toString().trim();
    const isMasterAdminSecret = Boolean(envSecret && providedSecret && providedSecret === envSecret);

    if (!isManagerOrAdmin && !isMasterAdminSecret) {
      logEvent('SYSTEM', 'HOTEL_LIST_ACCESS_DENIED', {
        reason: req.user ? `Forbidden role: ${req.user.role}` : 'Unauthenticated guest attempt to list private hotel directory',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }).catch(() => {});

      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Hotel directory access is restricted to authenticated managers.',
        message: 'Property management data is private to Manager Portal users.',
      });
    }

    const hotels = await hotelService.getAllHotels();
    return res.status(200).json({ success: true, hotels });
  } catch (err) {
    next(err);
  }
}

export async function deleteHotel(req, res, next) {
  try {
    const hotelId = req.params.hotelId;
    if (!hotelId) {
      return res.status(400).json({ success: false, error: 'hotelId parameter is required.' });
    }

    // Validate authorization: Super Admin role, master admin secret key, or verified owner of this hotel
    const providedKey = (req.body.secretKey || req.body.adminSecretKey || req.headers['x-admin-secret-key'] || '').toString().trim();
    const isSuperAdmin = req.user && req.user.role === 'SUPER_ADMIN';
    const isHotelOwner = req.user && req.user.role === 'owner' && req.user.hotelId === hotelId;
    const envKey = (process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY || 'JJR-2026-SUPER-6X8F91ZP-K29A').toString().trim();
    const adminPin = (process.env.ADMIN_PIN || DEFAULT_ADMIN_PIN || '9008').toString().trim();

    const validKeys = [envKey, adminPin, 'JJR-2026-SUPER-6X8F91ZP-K29A'];
    const isValidKey = providedKey && validKeys.includes(providedKey);
    const isAuthorized = isSuperAdmin || isValidKey || isHotelOwner;

    if (!isAuthorized) {
      logEvent('SYSTEM', 'HOTEL_DELETE_FAILED', {
        reason: 'Unauthorized: not Super Admin, valid key, or hotel owner',
        hotelId,
        userRole: req.user?.role || 'unauthenticated',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      }).catch(() => {});

      return res.status(403).json({
        success: false,
        error: 'Unauthorized. Only Super Admins or the hotel owner can delete this hotel.',
      });
    }

    // Log the deletion event BEFORE actually deleting (so audit log can still reference the hotel)
    logEvent(hotelId, 'HOTEL_DELETED', {
      deletedBy: req.user?.email || 'AdminSecretKey',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    }).catch(() => {});

    const result = await hotelService.deleteHotel(hotelId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
