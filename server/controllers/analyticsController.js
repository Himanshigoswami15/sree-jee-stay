import * as analyticsService from '../services/analyticsService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function dashboard(req, res, next) {
  try {
    const identifier = req.query.hotelSlug || req.query.hotelId || req.hotelId || DEFAULT_HOTEL_ID;
    const metrics = await analyticsService.getDashboardMetrics(identifier);
    return res.status(200).json({ success: true, metrics });
  } catch (err) {
    next(err);
  }
}
