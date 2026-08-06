import * as settingsService from '../services/settingsService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function list(req, res, next) {
  try {
    const identifier = req.hotelId || req.query.hotelSlug || req.query.hotelId;
    if (!identifier) {
      throw new AppError('hotelSlug or hotelId parameter is required.', 400);
    }

    const keywords = await settingsService.getKeywords(identifier);
    return res.status(200).json({ success: true, keywords });
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const identifier = req.hotelId || req.user?.hotelId;
    if (!identifier) {
      throw new AppError('Authentication required to add keyword tag.', 401);
    }

    const { type, ...tagData } = req.body;
    const result = await settingsService.addKeyword(identifier, type, tagData, req);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const identifier = req.hotelId || req.user?.hotelId;
    if (!identifier) {
      throw new AppError('Authentication required to delete keyword tag.', 401);
    }

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
    const identifier = req.hotelId || req.user?.hotelId;
    if (!identifier) {
      throw new AppError('Authentication required to update keyword tag.', 401);
    }

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
    const identifier = req.hotelId || req.user?.hotelId;
    if (!identifier) {
      throw new AppError('Authentication required to reorder keyword tags.', 401);
    }

    const { type = 'positive', tagIds = [] } = req.body;
    const result = await settingsService.reorderKeywords(identifier, type, tagIds, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function applyTemplate(req, res, next) {
  try {
    const identifier = req.hotelId || req.user?.hotelId;
    if (!identifier) {
      throw new AppError('Authentication required to apply keyword template.', 401);
    }

    const { templateKey, keywords } = req.body;
    const result = await settingsService.applyKeywordTemplate(identifier, templateKey, keywords, req);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
