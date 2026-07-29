import { Notification } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function createNotification(identifier = DEFAULT_HOTEL_ID, type, feedbackId = null, message) {
  try {
    const hotel = await getHotel(identifier);
    const hotelId = hotel ? hotel.hotelId : identifier;

    const notification = await Notification.create({
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

export async function getUnreadNotifications(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

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

export async function markAsRead(notificationId, identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  await Notification.updateOne(
    { _id: notificationId, hotelId },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return { success: true };
}
