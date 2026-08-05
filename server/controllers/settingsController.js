import * as settingsService from '../services/settingsService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function get(req, res, next) {
  try {
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId;
    if (!identifier) {
      throw new AppError('hotelSlug or hotelId parameter is required.', 400);
    }
    const settings = await settingsService.getSettings(identifier);
    console.log(`[Settings API Debug] hotelSlug: "${identifier}", returning googleReviewUrl: "${settings?.googleReviewUrl}"`);
    return res.status(200).json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelSlug || req.body.hotelId;
    if (!identifier) {
      throw new AppError('hotelSlug or hotelId is required.', 400);
    }
    const result = await settingsService.updateSettings(identifier, req.body, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
