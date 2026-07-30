import * as settingsService from '../services/settingsService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function list(req, res, next) {
  try {
    const identifier = req.query.hotelId || req.query.hotelSlug || req.hotelId || DEFAULT_HOTEL_ID;
    const keywords = await settingsService.getKeywords(identifier);
    return res.status(200).json({ success: true, keywords });
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelId || req.body.hotelSlug || DEFAULT_HOTEL_ID;
    const { type, ...tagData } = req.body;
    const result = await settingsService.addKeyword(identifier, type, tagData, req);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId || DEFAULT_HOTEL_ID;
    const { tagId } = req.params;
    const { type = 'positive' } = req.query;
    const result = await settingsService.deleteKeyword(identifier, type, tagId, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelId || req.body.hotelSlug || DEFAULT_HOTEL_ID;
    const { tagId } = req.params;
    const { type = 'positive', ...tagData } = req.body;
    const result = await settingsService.updateKeyword(identifier, type, tagId, tagData, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function reorder(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelId || req.body.hotelSlug || DEFAULT_HOTEL_ID;
    const { type = 'positive', tagIds = [] } = req.body;
    const result = await settingsService.reorderKeywords(identifier, type, tagIds, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function applyTemplate(req, res, next) {
  try {
    const identifier = req.hotelId || req.body.hotelId || req.body.hotelSlug || DEFAULT_HOTEL_ID;
    const { templateKey, keywords } = req.body;
    const result = await settingsService.applyKeywordTemplate(identifier, templateKey, keywords, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
