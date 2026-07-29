import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

/**
 * Custom MongoDB query operator sanitizer middleware
 * Strips keys starting with '$' or containing '.' from req.body, req.query, and req.params to prevent MongoDB injection attacks.
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = sanitizeObject(obj[key]);
  }
  return clean;
}

export function mongoSanitizer(req, _res, next) {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.params) {
    const cleanParams = sanitizeObject(req.params);
    Object.keys(req.params).forEach((k) => delete req.params[k]);
    Object.assign(req.params, cleanParams);
  }
  if (req.query) {
    const cleanQuery = sanitizeObject(req.query);
    Object.keys(req.query).forEach((k) => delete req.query[k]);
    Object.assign(req.query, cleanQuery);
  }
  next();
}

/**
 * Configure Helmet Security Headers for API and embedded web UI
 */
export const helmetSecurity = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});

/**
 * Rate Limiting Protection Middleware
 */

// 1. Auth Endpoint Limiter (Login / Password change) — 20 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Guest Feedback Submission Limiter — 30 submissions per 15 minutes
export const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Submission rate limit reached. Please wait a few minutes before submitting another review.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Hotel Onboarding Limiter — 20 hotel creations per hour
export const onboardLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Hotel onboarding rate limit reached. Please try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. General API Rate Limiter — 500 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
