/**
 * Centralized JJ Review System Constants
 */

// Authentication
export const BCRYPT_SALT_ROUNDS = 10;
export const DEFAULT_ADMIN_PIN = process.env.ADMIN_PIN || '9008';
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';
export const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 10;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Audit Log TTL (90 days)
export const AUDIT_LOG_TTL_DAYS = 90;

// Default Hotel Identifiers
export const DEFAULT_HOTEL_ID = 'sree-jee-stay';
export const DEFAULT_HOTEL_SLUG = 'sree-jee-stay';
export const DEFAULT_HOTELS = ['sree-jee-stay', 'demo'];
export const DEFAULT_ALERT_THRESHOLD = 3;

// User Roles
export const USER_ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  RECEPTION: 'reception',
};

// Writing Tones
export const WRITING_TONES = ['professional', 'friendly', 'luxury', 'budget', 'family', 'business'];

// Event Types
export const EVENT_TYPES = {
  FEEDBACK_SUBMITTED: 'FEEDBACK_SUBMITTED',
  MANAGER_ALERTED: 'MANAGER_ALERTED',
  ALERT_RESOLVED: 'ALERT_RESOLVED',
  MANAGER_LOGIN_SUCCESS: 'MANAGER_LOGIN_SUCCESS',
  MANAGER_LOGIN_FAILED: 'MANAGER_LOGIN_FAILED',
  MANAGER_LOGOUT: 'MANAGER_LOGOUT',
  MANAGER_PASSWORD_CHANGED: 'MANAGER_PASSWORD_CHANGED',
  MANAGER_PIN_RESET: 'MANAGER_PIN_RESET',
  SETTINGS_UPDATED: 'SETTINGS_UPDATED',
  KEYWORD_ADDED: 'KEYWORD_ADDED',
  KEYWORD_DELETED: 'KEYWORD_DELETED',
  DUPLICATE_REVIEW_BLOCKED: 'DUPLICATE_REVIEW_BLOCKED',
  PROVIDER_CLICKED: 'PROVIDER_CLICKED',
};

// Feedback Statuses
export const FEEDBACK_STATUSES = {
  SUBMITTED: 'Submitted',
  PUBLIC_POSTED: 'Public Posted',
  MANAGER_ALERTED: 'Manager Alerted',
  MANAGER_RESOLVED: 'Manager Resolved',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  LOW_RATING_ALERT: 'low_rating_alert',
  DUPLICATE_BLOCKED: 'duplicate_blocked',
  SYSTEM: 'system',
};

// Keyword Categories
export const KEYWORD_CATEGORIES = [
  'Service', 'Amenities', 'Cleanliness', 'Dining', 'Comfort', 'General'
];
