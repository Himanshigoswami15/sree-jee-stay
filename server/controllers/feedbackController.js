import * as feedbackService from '../services/feedbackService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function submit(req, res, next) {
  try {
    const identifier = req.body.hotelSlug || req.body.hotelId || req.params.hotelId || DEFAULT_HOTEL_ID;
    const result = await feedbackService.submitFeedback(identifier, req.body, req);

    if (result.isDuplicate) {
      return res.status(200).json(result);
    }

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    // Force req.hotelId derived from JWT if authenticated manager
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId || DEFAULT_HOTEL_ID;
    const result = await feedbackService.getFeedbacks(identifier, req.query);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function resolve(req, res, next) {
  try {
    // Force req.hotelId derived from JWT
    const identifier = req.hotelId || DEFAULT_HOTEL_ID;
    const { id } = req.params;
    const userId = req.user?.userId || null;
    const result = await feedbackService.resolveAlert(identifier, id, userId, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function checkDuplicate(req, res, next) {
  try {
    const identifier = req.query.hotelSlug || req.query.hotelId || DEFAULT_HOTEL_ID;
    const contact = req.query.contact || '';
    const isDuplicate = await feedbackService.checkDuplicate(identifier, contact);
    return res.status(200).json({ success: true, isDuplicate });
  } catch (err) {
    next(err);
  }
}
