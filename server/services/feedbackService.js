import { Feedback, DuplicateReview } from '../models/index.js';
import { getSettings } from './settingsService.js';
import { getHotel } from './hotelService.js';
import { createNotification } from './notificationService.js';
import { logEvent } from './auditService.js';
import { AppError } from '../middleware/errorHandler.js';
import { FEEDBACK_STATUSES, DEFAULT_HOTEL_ID } from '../config/constants.js';

export function normalizeContact(input) {
  if (!input) return '';
  const trimmed = String(input).trim();
  if (!trimmed) return '';

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 10) return digits.slice(-10);
  if (digits.length > 0) return digits;
  return trimmed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export async function checkDuplicate(identifier = DEFAULT_HOTEL_ID, contactStr) {
  if (!contactStr) return false;
  const norm = normalizeContact(contactStr);
  if (!norm) return false;

  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const existing = await DuplicateReview.findOne({ hotelId, normalizedContact: norm });
  return Boolean(existing);
}

export async function submitFeedback(identifier = DEFAULT_HOTEL_ID, feedbackData, req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const settings = await getSettings(hotelId);
  const contact = feedbackData.guestContact || '';
  const normContact = normalizeContact(contact);

  if (settings.preventDuplicateReviews && normContact) {
    const isDup = await checkDuplicate(hotelId, contact);
    if (isDup) {
      await logEvent(hotelId, 'DUPLICATE_REVIEW_BLOCKED', { contact }, req);
      await createNotification(hotelId, 'duplicate_blocked', null, `Duplicate review blocked for contact: ${contact}`);

      return {
        success: false,
        isDuplicate: true,
        error: 'DUPLICATE_REVIEW',
        message: `A review has already been submitted for Phone/Customer ID: ${contact}`,
      };
    }
  }

  const isLowRating = feedbackData.rating <= settings.alertThreshold;
  const status = isLowRating
    ? FEEDBACK_STATUSES.MANAGER_ALERTED
    : (feedbackData.postedPublic ? FEEDBACK_STATUSES.PUBLIC_POSTED : FEEDBACK_STATUSES.SUBMITTED);

  const feedback = await Feedback.create({
    hotelId,
    rating: feedbackData.rating,
    tags: feedbackData.tags || [],
    reviewText: feedbackData.reviewText || '',
    guestContact: contact,
    guestContactNormalized: normContact,
    postedPublic: feedbackData.postedPublic || false,
    alertSent: isLowRating,
    managerResolved: false,
    status,
  });

  if (normContact) {
    await DuplicateReview.create({
      hotelId,
      normalizedContact: normContact,
      originalContact: contact,
      feedbackId: feedback._id,
    }).catch(() => {});
  }

  await logEvent(hotelId, 'FEEDBACK_SUBMITTED', { rating: feedback.rating }, req);

  if (isLowRating) {
    await logEvent(hotelId, 'MANAGER_ALERTED', { rating: feedback.rating }, req);
    await createNotification(
      hotelId,
      'low_rating_alert',
      feedback._id,
      `🚨 Low Rating Alert! Guest submitted ${feedback.rating}-Star Feedback.`
    );
  }

  return {
    success: true,
    submission: {
      id: feedback._id.toString(),
      rating: feedback.rating,
      tags: feedback.tags,
      reviewText: feedback.reviewText,
      status: feedback.status,
      alertSent: feedback.alertSent,
      managerResolved: feedback.managerResolved,
      timestamp: feedback.createdAt.toISOString(),
      guestContact: feedback.guestContact,
      postedPublic: feedback.postedPublic,
    },
  };
}

export async function getFeedbacks(identifier = DEFAULT_HOTEL_ID, options = {}) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const { page = 1, limit = 50, rating, status, search } = options;
  const query = { hotelId };

  if (rating && rating !== 'all') {
    query.rating = parseInt(rating, 10);
  }

  if (status && status !== 'all') {
    if (status === 'alerts') {
      query.rating = { $lte: 3 };
      query.managerResolved = false;
    } else if (status === 'resolved') {
      query.managerResolved = true;
    } else if (status === 'public') {
      query.postedPublic = true;
    }
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { reviewText: searchRegex },
      { guestContact: searchRegex },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [items, total] = await Promise.all([
    Feedback.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
    Feedback.countDocuments(query),
  ]);

  const formattedItems = items.map((fb) => ({
    id: fb._id.toString(),
    rating: fb.rating,
    tags: fb.tags,
    reviewText: fb.reviewText,
    status: fb.status,
    alertSent: fb.alertSent,
    managerResolved: fb.managerResolved,
    timestamp: fb.createdAt.toISOString(),
    guestContact: fb.guestContact,
    postedPublic: fb.postedPublic,
  }));

  return {
    success: true,
    feedbacks: formattedItems,
    pagination: {
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit, 10),
    },
  };
}

export async function resolveAlert(identifier = DEFAULT_HOTEL_ID, feedbackId, userId = null, req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const feedback = await Feedback.findOne({ _id: feedbackId, hotelId });

  if (!feedback) {
    throw new AppError('Feedback submission not found.', 404);
  }

  feedback.managerResolved = true;
  feedback.status = FEEDBACK_STATUSES.MANAGER_RESOLVED;
  feedback.resolvedAt = new Date();
  if (userId) feedback.resolvedBy = userId;
  await feedback.save();

  await logEvent(hotelId, 'ALERT_RESOLVED', { feedbackId }, req);

  return {
    success: true,
    message: 'Alert marked as resolved successfully.',
    feedback: {
      id: feedback._id.toString(),
      status: feedback.status,
      managerResolved: true,
    },
  };
}
