import { logger } from '../utils/logger.js';

/**
 * Centralized Express Error Handler
 * Catches Mongoose validation errors, Zod errors, JWT errors, and generic errors.
 * Returns consistent { success: false, error, statusCode } response shape.
 */
export function errorHandler(err, req, res, _next) {
  const requestId = req.requestId || 'unknown';
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = undefined;

  // Mongoose Validation Error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `Duplicate value for "${field}". This record already exists.`;
  }

  // Mongoose CastError (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for "${err.path}": ${err.value}`;
  }

  // Zod Validation Error
  if (err.name === 'ZodError' || (err.issues && Array.isArray(err.issues))) {
    statusCode = 400;
    message = 'Validation failed';
    details = (err.issues || err.errors || []).map((issue) => ({
      field: issue.path?.join('.') || 'unknown',
      message: issue.message,
    }));
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`[ErrorHandler] ${statusCode} ${req.method} ${req.originalUrl}: ${err.message}`, {
      stack: err.stack,
    });
  } else {
    logger.warn(`[ErrorHandler] ${statusCode} ${req.method} ${req.originalUrl}: ${message}`);
  }

  const response = { success: false, error: message, requestId };
  if (details) response.details = details;

  res.status(statusCode).json(response);
}

/**
 * Custom application error class with status code
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
