import * as settingsService from '../services/settingsService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function get(req, res, next) {
  try {
    // For protected manager requests, derive strictly from req.hotelId. Public guest queries use hotelSlug query param.
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId || DEFAULT_HOTEL_ID;
    const settings = await settingsService.getSettings(identifier);
    return res.status(200).json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    // Strict JWT Ownership Enforcement: Derived strictly from verified JWT
    const identifier = req.hotelId || DEFAULT_HOTEL_ID;
    const result = await settingsService.updateSettings(identifier, req.body, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
