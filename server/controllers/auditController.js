import { logEvent, getAuditLogs } from '../services/auditService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function create(req, res, next) {
  try {
    const identifier = req.body.hotelSlug || req.body.hotelId || req.hotelId || DEFAULT_HOTEL_ID;
    const { eventType, details } = req.body;
    await logEvent(identifier, eventType, details, req);
    return res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const identifier = req.query.hotelSlug || req.query.hotelId || req.hotelId || DEFAULT_HOTEL_ID;
    const logs = await getAuditLogs(identifier);
    return res.status(200).json({ success: true, logs });
  } catch (err) {
    next(err);
  }
}
