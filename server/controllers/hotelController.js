import * as hotelService from '../services/hotelService.js';

export async function onboard(req, res, next) {
  try {
    const result = await hotelService.onboardHotel(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const hotels = await hotelService.getAllHotels();
    return res.status(200).json({ success: true, hotels });
  } catch (err) {
    next(err);
  }
}
