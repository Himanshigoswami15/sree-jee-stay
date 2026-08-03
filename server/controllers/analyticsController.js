import * as analyticsService from '../services/analyticsService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function dashboard(req, res, next) {
  try {
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId;
    if (!identifier) {
      throw new AppError('Hotel identifier parameter is required.', 400);
    }

    const metrics = await analyticsService.getDashboardMetrics(identifier);
    return res.status(200).json({ success: true, metrics });
  } catch (err) {
    next(err);
  }
}
