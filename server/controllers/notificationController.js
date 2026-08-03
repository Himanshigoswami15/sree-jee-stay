import * as notificationService from '../services/notificationService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function list(req, res, next) {
  try {
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const notifications = await notificationService.getUnreadNotifications(identifier);
    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelSlug || req.query.hotelSlug;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const { id } = req.params;
    const result = await notificationService.markAsRead(id, identifier);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
