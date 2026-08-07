import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenHelper.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { logEvent } from './auditService.js';
import { BCRYPT_SALT_ROUNDS, DEFAULT_ADMIN_PIN, MAX_LOGIN_ATTEMPTS, LOCK_DURATION_MS } from '../config/constants.js';
import { getHotel } from './hotelService.js';
import mongoose from 'mongoose';

export async function ensureDefaultUser(identifier) {
  const hotel = await getHotel(identifier);
  if (!hotel) {
    throw new AppError(`Hotel "${identifier}" not found.`, 404);
  }
  const resolvedHotelId = hotel.hotelId;

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database connection unavailable.', 503);
  }

  let user = await User.findOne({ hotelId: resolvedHotelId });
  if (!user) {
    const hash = bcrypt.hashSync(DEFAULT_ADMIN_PIN, BCRYPT_SALT_ROUNDS);
    user = await User.create({
      hotel: hotel._id,
      hotelId: resolvedHotelId,
      email: hotel.managerEmail || `${resolvedHotelId}@jjreviewsystem.com`,
      passwordHash: hash,
      role: 'owner',
      displayName: 'Hotel Manager',
      tokenVersion: 0,
    });
    logger.info(`[AuthService] Default manager user created in MongoDB for hotel "${resolvedHotelId}".`);
  }
  return user;
}

function makeTokenPayload(user, hotel) {
  return {
    userId: user._id.toString(),
    hotelId: user.hotelId,
    hotelSlug: hotel ? hotel.hotelSlug : user.hotelId,
    role: user.role,
    email: user.email,
    tokenVersion: user.tokenVersion || 0,
  };
}

export async function login(identifier, password, email = null) {
  if (!identifier) {
    throw new AppError('Hotel identifier is required', 400);
  }
  if (!password) {
    throw new AppError('Password or Security PIN is required', 400);
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database connection unavailable. Please check MongoDB connection status.', 503);
  }

  const hotel = await getHotel(identifier);
  if (!hotel) {
    throw new AppError(`Hotel "${identifier}" not found.`, 404);
  }
  const hotelId = hotel.hotelId;
  const user = await ensureDefaultUser(hotelId);

  if (user.isLocked && typeof user.isLocked === 'function' && user.isLocked()) {
    const minutesLeft = Math.ceil((user.lockedUntil - new Date()) / 60000);
    throw new AppError(`Account is temporarily locked. Retry in ${minutesLeft} minutes.`, 429);
  }

  let isMatch = false;
  try {
    if (user.passwordHash) {
      isMatch = bcrypt.compareSync(password, user.passwordHash);
    }
  } catch (e) {}

  if (!isMatch) {
    user.failedAttempts = (user.failedAttempts || 0) + 1;
    if (user.failedAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
      logger.warn(`[AuthService] Account locked for hotel "${hotelId}" after ${MAX_LOGIN_ATTEMPTS} failed attempts.`);
      logEvent(hotelId, 'ACCOUNT_LOCKED', { userId: String(user._id), failedAttempts: user.failedAttempts }).catch(() => {});
    }
    await user.save().catch(() => {});
    logEvent(hotelId, 'LOGIN_FAILED', { userId: String(user._id), attempt: user.failedAttempts }).catch(() => {});
    throw new AppError('Incorrect Security PIN / Password.', 401);
  }

  user.failedAttempts = 0;
  user.lockedUntil = null;
  user.lastLoginAt = new Date();
  await user.save().catch(() => {});
  logEvent(hotelId, 'LOGIN_SUCCESS', { userId: String(user._id), email: user.email }).catch(() => {});

  const payload = makeTokenPayload(user, hotel);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({
    userId: String(user._id),
    hotelId: user.hotelId,
    tokenVersion: user.tokenVersion || 0,
  });

  logger.info(`[AuthService] User logged in successfully for hotel "${hotelId}".`);

  return {
    success: true,
    message: 'Password verified successfully',
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      hotelId: user.hotelId,
      hotelSlug: hotel.hotelSlug || user.hotelId,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    },
  };
}

export async function changePassword(identifier, oldPassword, newPassword, isOtpReset = false) {
  if (!identifier) {
    throw new AppError('Hotel identifier is required.', 400);
  }
  if (!newPassword || newPassword.length < 4) {
    throw new AppError('New Password / PIN must be at least 4 characters long.', 400);
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database connection unavailable. Cannot update password in MongoDB.', 503);
  }

  const hotel = await getHotel(identifier);
  if (!hotel) {
    throw new AppError(`Hotel "${identifier}" not found.`, 404);
  }
  const hotelId = hotel.hotelId;

  const user = await ensureDefaultUser(hotelId);

  if (!isOtpReset) {
    if (!oldPassword) {
      throw new AppError('Current password is required to set a new password.', 400);
    }
    const isOldValid = user.passwordHash ? bcrypt.compareSync(oldPassword, user.passwordHash) : false;
    if (!isOldValid) {
      throw new AppError('Incorrect current password. Password update failed.', 401);
    }
  }

  user.passwordHash = bcrypt.hashSync(newPassword, BCRYPT_SALT_ROUNDS);
  user.failedAttempts = 0;
  user.lockedUntil = null;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  logger.info(`[AuthService] Password updated in MongoDB for hotel "${hotelId}". Incremented tokenVersion to ${user.tokenVersion} (all sessions revoked).`);
  logEvent(hotelId, 'PASSWORD_CHANGED', { userId: user._id.toString(), tokenVersion: user.tokenVersion, isOtpReset });

  return {
    success: true,
    message: 'Password updated successfully in MongoDB. All existing sessions across all devices have been invalidated.',
  };
}

export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError('Refresh token is required.', 400);
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.userId) {
    throw new AppError('Invalid refresh token.', 401);
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError('User account not found.', 404);
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    throw new AppError('Session expired due to password update. Please log in again.', 401);
  }

  const hotel = await getHotel(user.hotelId);
  const payload = makeTokenPayload(user, hotel);
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken({
    userId: user._id.toString(),
    hotelId: user.hotelId,
    tokenVersion: user.tokenVersion,
  });

  logEvent(user.hotelId, 'TOKEN_REFRESHED', { userId: user._id.toString() });
  return { success: true, accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(req) {
  const hotelId = req.user?.hotelId;
  const userId = req.user?.userId;
  if (hotelId) {
    logEvent(hotelId, 'LOGOUT', { userId });
    logger.info(`[AuthService] User logged out for hotel "${hotelId}".`);
  }
  return { success: true, message: 'Logged out successfully' };
}

export async function getAuthStatus(identifier) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  if (!hotel) return { success: false, error: 'Hotel not found' };
  const hotelId = hotel.hotelId;
  const user = await User.findOne({ hotelId });
  return {
    success: true,
    hotelId,
    hotelSlug: hotel.hotelSlug || hotelId,
    hasPassword: Boolean(user && user.passwordHash),
  };
}

export async function superAdminLogin(secretKey) {
  const expectedKey = process.env.ADMIN_SECRET_KEY || 'JJR-2026-SUPER-6X8F91ZP-K29A';
  if (!secretKey || secretKey.trim() !== expectedKey.trim()) {
    logEvent('SYSTEM', 'SUPER_ADMIN_LOGIN_FAILED', { reason: 'Invalid secret key' }).catch(() => {});
    throw new AppError('Invalid Admin Secret Key.', 403);
  }

  const payload = {
    userId: 'super_admin',
    hotelId: 'system',
    hotelSlug: 'system',
    role: 'SUPER_ADMIN',
    email: 'admin@jjreviewsystem.com',
    tokenVersion: 1,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  logEvent('SYSTEM', 'SUPER_ADMIN_LOGIN_SUCCESS', {}).catch(() => {});

  return {
    success: true,
    user: {
      userId: 'super_admin',
      email: 'admin@jjreviewsystem.com',
      role: 'SUPER_ADMIN',
      displayName: 'Super Admin',
    },
    accessToken,
    refreshToken,
  };
}
