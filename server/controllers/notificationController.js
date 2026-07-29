import * as notificationService from '../services/notificationService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function list(req, res, next) {
  try {
    const identifier = req.hotelId || DEFAULT_HOTEL_ID;
    const notifications = await notificationService.getUnreadNotifications(identifier);
    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  try {
    const identifier = req.hotelId || DEFAULT_HOTEL_ID;
    const { id } = req.params;
    const result = await notificationService.markAsRead(id, identifier);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
