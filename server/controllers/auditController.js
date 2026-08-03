import { logEvent, getAuditLogs } from '../services/auditService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function create(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelSlug || req.body.hotelId;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const { eventType, details } = req.body;
    await logEvent(identifier, eventType, details, req);
    return res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const logs = await getAuditLogs(identifier);
    return res.status(200).json({ success: true, logs });
  } catch (err) {
    next(err);
  }
}
