import mongoose from 'mongoose';
import { verifyAccessToken } from '../utils/tokenHelper.js';
import { User } from '../models/index.js';
import { logger } from '../utils/logger.js';

function fail(res, status, error, code) {
  const body = { success: false, error, requestId: res.req?.requestId };
  if (code) body.code = code;
  return res.status(status).json(body);
}

export async function authenticate(req, res, next) {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return fail(res, 401, 'Authentication required. Please log in to JJ Review System.');
    }

    const decoded = verifyAccessToken(token);

    if (decoded.userId && mongoose.connection.readyState === 1 && !String(decoded.userId).startsWith('fallback_')) {
      try {
        const user = await User.findById(decoded.userId);
        if (user && decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
          logger.warn(`[Auth Middleware] Revoked session detected for user ${user.email} (tokenVersion mismatch).`);
          return fail(res, 401, 'Session expired due to password update. Please log in again with your new password.', 'TOKEN_REVOKED');
        }
      } catch (dbErr) {
        logger.warn(`[Auth Middleware] User DB check skipped: ${dbErr.message}`);
      }
    }

    req.user = {
      userId: decoded.userId,
      hotelId: decoded.hotelId,
      hotelSlug: decoded.hotelSlug,
      role: decoded.role,
      email: decoded.email,
      tokenVersion: decoded.tokenVersion,
    };
    req.hotelId = decoded.hotelId;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return fail(res, 401, 'Session expired. Please log in again.', 'TOKEN_EXPIRED');
    }
    logger.warn(`[Auth Middleware] Invalid token: ${err.message}`);
    return fail(res, 401, 'Invalid authentication token.');
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return fail(res, 401, 'Authentication required.');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return fail(res, 403, 'Insufficient permissions for this action.');
    }
    next();
  };
}

export async function optionalAuth(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        hotelId: decoded.hotelId,
        hotelSlug: decoded.hotelSlug,
        role: decoded.role,
        email: decoded.email,
      };
      req.hotelId = decoded.hotelId;
    }
  } catch (err) {}
  next();
}
