import * as feedbackService from '../services/feedbackService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function submit(req, res, next) {
  try {
    const identifier = req.body.hotelSlug || req.body.hotelId || req.params.hotelId || req.hotelId;
    if (!identifier) {
      throw new AppError('hotelSlug or hotelId is required to submit feedback.', 400);
    }

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
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId;
    if (!identifier) {
      throw new AppError('hotelSlug or hotelId parameter is required.', 400);
    }

    const result = await feedbackService.getFeedbacks(identifier, req.query);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function resolve(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelSlug || req.query.hotelSlug;
    if (!identifier) {
      throw new AppError('hotelSlug or hotelId parameter is required.', 400);
    }

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
    const identifier = req.query.hotelSlug || req.query.hotelId || req.hotelId;
    if (!identifier) {
      throw new AppError('hotelSlug or hotelId parameter is required.', 400);
    }

    const contact = req.query.contact || '';
    const isDuplicate = await feedbackService.checkDuplicate(identifier, contact);
    return res.status(200).json({ success: true, isDuplicate });
  } catch (err) {
    next(err);
  }
}
