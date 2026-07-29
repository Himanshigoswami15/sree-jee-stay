import crypto from 'crypto';
import * as authService from '../services/authService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function setCsrfCookie(res) {
  const csrfToken = crypto.randomBytes(32).toString('hex');
  res.cookie('csrf-token', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function login(req, res, next) {
  try {
    const identifier = req.body.hotelId || req.body.hotelSlug || DEFAULT_HOTEL_ID;
    const { password, email } = req.body;
    const result = await authService.login(identifier, password, email);

    setAuthCookies(res, result.accessToken, result.refreshToken);
    setCsrfCookie(res);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelId || req.body.hotelSlug || DEFAULT_HOTEL_ID;
    const { oldPassword = '', newPassword = '', isOtpReset = false } = req.body;
    const result = await authService.changePassword(identifier, oldPassword, newPassword, isOtpReset);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('csrf-token');

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    const result = await authService.refreshAccessToken(refreshToken);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function status(req, res, next) {
  try {
    const identifier = req.query.hotelId || req.query.hotelSlug || DEFAULT_HOTEL_ID;
    const result = await authService.getAuthStatus(identifier);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) {
      return res.status(200).json({ success: true, authenticated: false });
    }
    return res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        userId: req.user.userId,
        hotelId: req.user.hotelId,
        hotelSlug: req.user.hotelSlug,
        role: req.user.role,
        email: req.user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logoutUser(req);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('csrf-token');
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}
