import mongoose from 'mongoose';
import { Settings, Keyword, Hotel } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { logEvent } from './auditService.js';
import { RATING_KEYWORDS } from '../../src/utils/reviewGenerator.js';
import { generateGoogleReviewUrl } from '../../src/utils/googleReview.js';
import { connectDB } from '../config/db.js';
import { logger } from '../utils/logger.js';
import { broadcastSystemEvent } from '../utils/eventBroadcaster.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getSettings(identifier) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;
  const hotelSlug = hotel ? (hotel.hotelSlug || hotelId) : identifier;

  if (mongoose.connection.readyState !== 1) {
    await connectDB(1, 500).catch(() => {});
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database connection unavailable.', 503);
  }

  let settings = await Settings.findOne({
    $or: [{ hotelId }, { hotelSlug }, { hotelId: identifier }, { hotelSlug: identifier }]
  });

  if (!settings) {
    settings = await Settings.create({
      hotelId,
      hotelSlug,
      hotelName: hotel ? hotel.name : 'Registered Hotel',
      logoUrl: hotel ? hotel.logoUrl : '',
      themeColor: hotel ? hotel.themeColor : '#2563eb',
      googlePlaceId: hotel ? hotel.googlePlaceId : (process.env.VITE_GOOGLE_PLACE_ID || ''),
      googleReviewUrl: hotel ? hotel.googleReviewUrl : generateGoogleReviewUrl(process.env.VITE_GOOGLE_PLACE_ID || ''),
      tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
      managerEmail: hotel ? (hotel.managerEmail || '') : '',
      managerPhone: hotel ? (hotel.managerPhone || '') : '',
      alertThreshold: 3,
      preventDuplicateReviews: true,
      tone: hotel ? (hotel.tone || 'friendly') : 'friendly',
      providers: [
        { type: 'google', isEnabled: true },
        { type: 'tripadvisor', isEnabled: true },
      ],
    });
  }

  return {
    hotelId: settings.hotelId,
    hotelSlug: settings.hotelSlug || hotelSlug,
    hotelName: settings.hotelName,
    logoUrl: settings.logoUrl || '',
    themeColor: settings.themeColor || '#2563eb',
    googlePlaceId: settings.googlePlaceId,
    googleReviewUrl: settings.googleReviewUrl,
    tripadvisorReviewUrl: settings.tripadvisorReviewUrl,
    managerEmail: settings.managerEmail,
    managerPhone: settings.managerPhone,
    alertThreshold: settings.alertThreshold,
    preventDuplicateReviews: settings.preventDuplicateReviews,
    tone: settings.tone || 'friendly',
    providers: settings.providers,
  };
}

export async function updateSettings(identifier, newSettings, req = null) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const current = await getSettings(identifier);
  const hotelId = current.hotelId || identifier;
  const hotelSlug = current.hotelSlug || identifier;
  const updatedData = { ...current, ...newSettings };

  if (newSettings.googlePlaceId && (!newSettings.googleReviewUrl || newSettings.googleReviewUrl === current.googleReviewUrl)) {
    updatedData.googleReviewUrl = generateGoogleReviewUrl(newSettings.googlePlaceId);
  } else if (newSettings.googleReviewUrl) {
    updatedData.googleReviewUrl = generateGoogleReviewUrl(newSettings.googleReviewUrl);
  }

  if (mongoose.connection.readyState !== 1) {
    await connectDB(1, 500).catch(() => {});
  }

  if (mongoose.connection.readyState !== 1) {
    throw new AppError('Database connection unavailable. Settings cannot be updated without a live MongoDB connection.', 503);
  }

  let settings = await Settings.findOne({
    $or: [{ hotelId }, { hotelSlug }, { hotelId: identifier }, { hotelSlug: identifier }]
  });

  if (settings) {
    Object.assign(settings, updatedData);
    settings = await settings.save();
  } else {
    settings = await Settings.create({ ...updatedData, hotelId, hotelSlug });
  }

  // Sync with Hotel model in MongoDB Atlas
  await Hotel.findOneAndUpdate(
    { $or: [{ hotelId }, { hotelSlug }, { hotelId: identifier }, { hotelSlug: identifier }] },
    {
      $set: {
        name: updatedData.hotelName,
        logoUrl: updatedData.logoUrl,
        themeColor: updatedData.themeColor,
        googlePlaceId: updatedData.googlePlaceId,
        googleReviewUrl: updatedData.googleReviewUrl,
        tripadvisorReviewUrl: updatedData.tripadvisorReviewUrl,
        managerEmail: updatedData.managerEmail,
        managerPhone: updatedData.managerPhone,
        alertThreshold: updatedData.alertThreshold,
        preventDuplicateReviews: updatedData.preventDuplicateReviews,
        tone: updatedData.tone,
      }
    }
  ).catch(() => {});

  await logEvent(hotelId, 'SETTINGS_UPDATED', newSettings, req).catch(() => {});

  const resultSettings = {
    hotelId: settings.hotelId,
    hotelSlug: settings.hotelSlug || identifier,
    hotelName: settings.hotelName,
    logoUrl: settings.logoUrl || '',
    themeColor: settings.themeColor || '#2563eb',
    googlePlaceId: settings.googlePlaceId,
    googleReviewUrl: settings.googleReviewUrl,
    tripadvisorReviewUrl: settings.tripadvisorReviewUrl,
    managerEmail: settings.managerEmail,
    managerPhone: settings.managerPhone,
    alertThreshold: settings.alertThreshold,
    preventDuplicateReviews: settings.preventDuplicateReviews,
    tone: settings.tone || 'friendly',
    providers: settings.providers,
  };

  // Broadcast real-time SSE event to all connected devices across the network
  broadcastSystemEvent(hotelSlug, 'SETTINGS_UPDATED', { settings: resultSettings });

  return {
    success: true,
    message: 'Settings updated successfully in MongoDB.',
    settings: resultSettings,
  };
}

export async function getKeywords(identifier) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const keywords = await Keyword.find({
    $or: [{ hotelId }, { hotelId: identifier }],
    isActive: true,
  }).sort({ sortOrder: 1 });

  if (keywords.length === 0) {
    await seedDefaultKeywords(hotelId).catch(() => {});
    const seeded = await Keyword.find({
      $or: [{ hotelId }, { hotelId: identifier }],
      isActive: true,
    }).sort({ sortOrder: 1 });
    return groupKeywords(seeded);
  }

  return groupKeywords(keywords);
}

function groupKeywords(keywords) {
  const positive = keywords
    .filter((k) => k.type === 'positive')
    .map((k) => ({
      id: k.tagId,
      tagId: k.tagId,
      label: k.label,
      category: k.category,
      snippet: k.snippet || k.label,
      snippets: k.snippets || [],
    }));

  const negative = keywords
    .filter((k) => k.type === 'negative')
    .map((k) => ({
      id: k.tagId,
      tagId: k.tagId,
      label: k.label,
      category: k.category,
      snippet: k.snippet || k.label,
      snippets: k.snippets || [],
    }));

  return { positive, negative };
}

async function seedDefaultKeywords(hotelId) {
  const docs = [];

  RATING_KEYWORDS.positive.forEach((item, idx) => {
    docs.push({
      hotelId,
      type: 'positive',
      tagId: item.id,
      label: item.label,
      category: item.category || 'General',
      snippet: item.snippet || item.label,
      snippets: item.snippets || [],
      sortOrder: idx,
    });
  });

  RATING_KEYWORDS.negative.forEach((item, idx) => {
    docs.push({
      hotelId,
      type: 'negative',
      tagId: item.id,
      label: item.label,
      category: item.category || 'General',
      snippet: item.snippet || item.label,
      snippets: item.snippets || [],
      sortOrder: idx,
    });
  });

  await Keyword.insertMany(docs).catch(() => {});
}

export async function addKeyword(identifier, type, tagData, req = null) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;
  const tagId = tagData.tagId || tagData.id || 'custom_' + Date.now().toString(36);

  const keyword = await Keyword.create({
    hotelId,
    type,
    tagId,
    label: tagData.label,
    category: tagData.category || 'General',
    snippet: tagData.snippet || tagData.label,
    snippets: tagData.snippets || [tagData.snippet || tagData.label],
    sortOrder: Date.now(),
    isActive: true,
  });

  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_ADDED', { type, label: tagData.label }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });

  return {
    success: true,
    keyword: {
      id: keyword.tagId,
      tagId: keyword.tagId,
      label: keyword.label,
      category: keyword.category,
      snippet: keyword.snippet,
      snippets: keyword.snippets,
    },
    keywords: updatedGroup,
  };
}

export async function deleteKeyword(identifier, type, tagId, req = null) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  await Keyword.deleteMany({
    $or: [{ hotelId }, { hotelId: identifier }],
    tagId,
  });

  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_DELETED', { type, tagId }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });
  return { success: true, message: 'Keyword tag deleted successfully.', keywords: updatedGroup };
}

export async function updateKeyword(identifier, type, tagId, tagData, req = null) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  await Keyword.updateMany(
    {
      $or: [{ hotelId }, { hotelId: identifier }],
      tagId,
    },
    {
      $set: {
        label: tagData.label,
        category: tagData.category || 'General',
        snippet: tagData.snippet || tagData.label,
        snippets: tagData.snippets || [tagData.snippet || tagData.label],
      },
    }
  );

  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_UPDATED', { type, tagId, label: tagData.label }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });

  return {
    success: true,
    keyword: { id: tagId, tagId, ...tagData },
    keywords: updatedGroup,
  };
}

export async function reorderKeywords(identifier, type, tagIds = [], req = null) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const ops = tagIds.map((tagId, index) => ({
    updateMany: {
      filter: {
        $or: [{ hotelId }, { hotelId: identifier }],
        tagId,
      },
      update: { $set: { sortOrder: index } },
    },
  }));

  if (ops.length > 0) {
    await Keyword.bulkWrite(ops).catch(() => {});
  }

  await logEvent(hotelId, 'KEYWORD_REORDERED', { type, count: tagIds.length }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED');
  return { success: true };
}

export async function applyKeywordTemplate(identifier, templateKey, customKeywords = [], req = null) {
  if (!identifier) throw new AppError('Hotel identifier is required.', 400);
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  await Keyword.deleteMany({
    $or: [{ hotelId }, { hotelId: identifier }]
  });

  const docs = customKeywords.map((item, idx) => ({
    hotelId,
    type: item.type || 'positive',
    tagId: item.id || item.tagId || 'tmpl_' + idx + '_' + Date.now().toString(36),
    label: item.label,
    category: item.category || 'General',
    snippet: item.snippet || item.label,
    snippets: item.snippets || [item.snippet || item.label],
    sortOrder: idx,
    isActive: true,
  }));

  if (docs.length > 0) {
    await Keyword.insertMany(docs);
  }

  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_TEMPLATE_APPLIED', { templateKey, count: customKeywords.length }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });
  return { success: true, count: customKeywords.length, keywords: updatedGroup };
}
