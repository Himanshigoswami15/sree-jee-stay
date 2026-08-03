import { Notification } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { logger } from '../utils/logger.js';

export async function createNotification(identifier, type, feedbackId = null, message = '') {
  if (!identifier) return null;
  try {
    const hotel = await getHotel(identifier);
    if (!hotel) return null;

    const hotelId = hotel.hotelId;

    const notification = await Notification.create({
      hotel: hotel._id,
      hotelId,
      type,
      feedbackId,
      message,
      isRead: false,
    });
    logger.info(`[Notification] Created notification for hotel "${hotelId}": ${message}`);
    return notification;
  } catch (err) {
    logger.error(`[Notification] Error creating notification: ${err.message}`);
    return null;
  }
}

export async function getUnreadNotifications(identifier) {
  if (!identifier) return [];
  const hotel = await getHotel(identifier);
  if (!hotel) return [];

  const hotelId = hotel.hotelId;

  const notifications = await Notification.find({ hotelId, isRead: false })
    .sort({ createdAt: -1 })
    .limit(50);

  return notifications.map((n) => ({
    id: n._id.toString(),
    type: n.type,
    feedbackId: n.feedbackId?.toString() || null,
    message: n.message,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function markAsRead(notificationId, identifier) {
  if (!identifier) return { success: false };
  const hotel = await getHotel(identifier);
  if (!hotel) return { success: false };

  const hotelId = hotel.hotelId;

  await Notification.updateOne(
    { _id: notificationId, hotelId },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return { success: true };
}
