import { AuditLog } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function logEvent(identifier = DEFAULT_HOTEL_ID, eventType, details = {}, req = null) {
  try {
    const hotel = await getHotel(identifier);
    const hotelId = hotel ? hotel.hotelId : identifier;

    const ipAddress = req ? (req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '') : '';
    const userAgent = req ? (req.headers['user-agent'] || '') : '';
    const userId = req?.user?.userId || null;

    const logEntry = await AuditLog.create({
      hotelId,
      eventType,
      details,
      userId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });

    logger.debug(`[AuditLog][${hotelId}] ${eventType}`, details);
    return logEntry;
  } catch (err) {
    logger.error(`[AuditLog] Failed to write audit log: ${err.message}`);
    return null;
  }
}

export async function getAuditLogs(identifier = DEFAULT_HOTEL_ID, limit = 100) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const logs = await AuditLog.find({ hotelId })
    .sort({ timestamp: -1 })
    .limit(limit);

  return logs.map((l) => ({
    id: l._id.toString(),
    hotelId: l.hotelId,
    eventType: l.eventType,
    details: l.details,
    timestamp: l.timestamp.toISOString(),
    userAgent: l.userAgent,
  }));
}
