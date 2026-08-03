import { AuditLog } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { logger } from '../utils/logger.js';

export async function logEvent(identifier, eventType, details = {}, req = null) {
  if (!identifier) return null;
  try {
    const hotel = await getHotel(identifier);
    if (!hotel) return null;

    const hotelId = hotel.hotelId;

    const ipAddress = req ? (req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '') : '';
    const userAgent = req ? (req.headers['user-agent'] || '') : '';
    const userId = req?.user?.userId || null;

    const logEntry = await AuditLog.create({
      hotel: hotel._id,
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

export async function getAuditLogs(identifier, limit = 100) {
  if (!identifier) return [];
  const hotel = await getHotel(identifier);
  if (!hotel) return [];

  const hotelId = hotel.hotelId;

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
