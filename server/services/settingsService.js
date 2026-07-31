import mongoose from 'mongoose';
import { Settings, Keyword } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { logEvent } from './auditService.js';
import { RATING_KEYWORDS } from '../../src/utils/reviewGenerator.js';
import { generateGoogleReviewUrl } from '../../src/utils/googleReview.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

const memorySettingsStore = new Map();
const memoryKeywordsStore = new Map();

export async function getSettings(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;
  const hotelSlug = hotel ? hotel.hotelSlug : hotelId;

  const fallbackSettings = {
    hotelId,
    hotelSlug,
    hotelName: hotel ? hotel.name : 'Sree Jee Stay - Homestay in Varanasi',
    logoUrl: hotel ? hotel.logoUrl : '',
    themeColor: hotel ? hotel.themeColor : '#2563eb',
    googlePlaceId: hotel ? hotel.googlePlaceId : (process.env.VITE_GOOGLE_PLACE_ID || ''),
    googleReviewUrl: hotel ? hotel.googleReviewUrl : 'https://g.page/r/CTERYeDefsTREAE/review',
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: 'himanshigoswami9057@gmail.com',
    managerPhone: '+91 98765 43210',
    alertThreshold: 3,
    preventDuplicateReviews: true,
    tone: hotel ? hotel.tone : 'friendly',
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true },
    ],
  };

  if (mongoose.connection.readyState !== 1) {
    if (memorySettingsStore.has(hotelId)) return memorySettingsStore.get(hotelId);
    if (memorySettingsStore.has(hotelSlug)) return memorySettingsStore.get(hotelSlug);
    return fallbackSettings;
  }

  try {
    let settings = await Settings.findOne({ hotelId });

    if (!settings) {
      settings = await Settings.create({
        hotelId,
        hotelSlug,
        hotelName: hotel ? hotel.name : 'Sree Jee Stay - Homestay in Varanasi',
        logoUrl: hotel ? hotel.logoUrl : '',
        themeColor: hotel ? hotel.themeColor : '#2563eb',
        googlePlaceId: hotel ? hotel.googlePlaceId : (process.env.VITE_GOOGLE_PLACE_ID || ''),
        googleReviewUrl: hotel ? hotel.googleReviewUrl : generateGoogleReviewUrl(process.env.VITE_GOOGLE_PLACE_ID || ''),
        tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
        managerEmail: 'himanshigoswami9057@gmail.com',
        managerPhone: '+91 98765 43210',
        alertThreshold: 3,
        preventDuplicateReviews: true,
        tone: hotel ? hotel.tone : 'friendly',
        providers: [
          { type: 'google', isEnabled: true },
          { type: 'tripadvisor', isEnabled: true },
        ],
      });
    }

    if (settings) {
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
  } catch (err) {
    logger.warn(`[SettingsService] DB query failed, returning fallback settings for "${hotelId}": ${err.message}`);
  }

  return fallbackSettings;
}

export async function updateSettings(identifier = DEFAULT_HOTEL_ID, newSettings, req = null) {
  const current = await getSettings(identifier);
  const hotelId = current.hotelId;
  const updatedData = { ...current, ...newSettings };

  if (newSettings.googlePlaceId && (!newSettings.googleReviewUrl || newSettings.googleReviewUrl === current.googleReviewUrl)) {
    updatedData.googleReviewUrl = generateGoogleReviewUrl(newSettings.googlePlaceId);
  } else if (newSettings.googleReviewUrl) {
    updatedData.googleReviewUrl = generateGoogleReviewUrl(newSettings.googleReviewUrl);
  }

  let settings = await Settings.findOne({ hotelId });
  if (settings) {
    Object.assign(settings, updatedData);
    settings = await settings.save();
  } else {
    settings = await Settings.create(updatedData);
  }

  await logEvent(hotelId, 'SETTINGS_UPDATED', newSettings, req);

  const resultSettings = {
    hotelId: settings ? settings.hotelId : hotelId,
    hotelSlug: settings ? settings.hotelSlug : identifier,
    hotelName: settings ? settings.hotelName : updatedData.hotelName,
    logoUrl: settings ? settings.logoUrl : updatedData.logoUrl,
    themeColor: settings ? settings.themeColor : updatedData.themeColor,
    googlePlaceId: settings ? settings.googlePlaceId : updatedData.googlePlaceId,
    googleReviewUrl: settings ? settings.googleReviewUrl : updatedData.googleReviewUrl,
    tripadvisorReviewUrl: settings ? settings.tripadvisorReviewUrl : updatedData.tripadvisorReviewUrl,
    managerEmail: settings ? settings.managerEmail : updatedData.managerEmail,
    managerPhone: settings ? settings.managerPhone : updatedData.managerPhone,
    alertThreshold: settings ? settings.alertThreshold : updatedData.alertThreshold,
    preventDuplicateReviews: settings ? settings.preventDuplicateReviews : updatedData.preventDuplicateReviews,
    tone: settings ? settings.tone : updatedData.tone,
    providers: settings ? settings.providers : updatedData.providers,
  };

  memorySettingsStore.set(hotelId, resultSettings);
  memorySettingsStore.set(identifier, resultSettings);

  return {
    success: true,
    message: 'Settings updated successfully.',
    settings: resultSettings,
  };
}

export async function getKeywords(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  if (mongoose.connection.readyState !== 1) {
    if (memoryKeywordsStore.has(hotelId)) return memoryKeywordsStore.get(hotelId);
    if (memoryKeywordsStore.has(identifier)) return memoryKeywordsStore.get(identifier);
  }

  try {
    const keywords = await Keyword.find({ hotelId, isActive: true }).sort({ sortOrder: 1 });

    if (keywords.length === 0) {
      await seedDefaultKeywords(hotelId).catch(() => {});
      const seeded = await Keyword.find({ hotelId, isActive: true }).sort({ sortOrder: 1 });
      if (seeded.length > 0) return groupKeywords(seeded);
    } else {
      return groupKeywords(keywords);
    }
  } catch (err) {
    logger.warn(`[SettingsService] DB query failed, returning fallback keywords for "${hotelId}": ${err.message}`);
  }

  if (memoryKeywordsStore.has(hotelId)) return memoryKeywordsStore.get(hotelId);
  if (memoryKeywordsStore.has(identifier)) return memoryKeywordsStore.get(identifier);

  return groupKeywords(
    RATING_KEYWORDS.positive.map((k, idx) => ({ ...k, tagId: k.id, type: 'positive', sortOrder: idx })).concat(
      RATING_KEYWORDS.negative.map((k, idx) => ({ ...k, tagId: k.id, type: 'negative', sortOrder: idx }))
    )
  );
}

function groupKeywords(keywords) {
  const positive = keywords
    .filter((k) => k.type === 'positive')
    .map((k) => ({
      id: k.tagId,
      label: k.label,
      category: k.category,
      snippet: k.snippet || k.label,
      snippets: k.snippets || [],
    }));

  const negative = keywords
    .filter((k) => k.type === 'negative')
    .map((k) => ({
      id: k.tagId,
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

export async function addKeyword(identifier = DEFAULT_HOTEL_ID, type, tagData, req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;
  const tagId = tagData.tagId || 'custom_' + Date.now().toString(36);

  let newKw = {
    id: tagId,
    tagId,
    label: tagData.label,
    category: tagData.category || 'General',
    snippet: tagData.snippet || tagData.label,
    snippets: tagData.snippets || [tagData.snippet || tagData.label],
  };

  try {
    const keyword = await Keyword.create({
      hotelId,
      type,
      tagId,
      label: tagData.label,
      category: tagData.category || 'General',
      snippet: tagData.snippet || tagData.label,
      snippets: tagData.snippets || [tagData.snippet || tagData.label],
    });
    newKw = {
      id: keyword.tagId,
      label: keyword.label,
      category: keyword.category,
      snippet: keyword.snippet,
      snippets: keyword.snippets,
    };
  } catch (err) {}

  const current = memoryKeywordsStore.get(hotelId) || groupKeywords(
    RATING_KEYWORDS.positive.map((k, idx) => ({ ...k, tagId: k.id, type: 'positive', sortOrder: idx })).concat(
      RATING_KEYWORDS.negative.map((k, idx) => ({ ...k, tagId: k.id, type: 'negative', sortOrder: idx }))
    )
  );

  const updatedGroup = {
    ...current,
    [type]: [...(current[type] || []), newKw],
  };
  memoryKeywordsStore.set(hotelId, updatedGroup);
  memoryKeywordsStore.set(identifier, updatedGroup);

  await logEvent(hotelId, 'KEYWORD_ADDED', { type, label: tagData.label }, req).catch(() => {});

  return {
    success: true,
    keyword: newKw,
  };
}

export async function deleteKeyword(identifier = DEFAULT_HOTEL_ID, type, tagId, req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  await Keyword.deleteOne({ hotelId, tagId }).catch(() => {});

  const current = memoryKeywordsStore.get(hotelId) || groupKeywords(
    RATING_KEYWORDS.positive.map((k, idx) => ({ ...k, tagId: k.id, type: 'positive', sortOrder: idx })).concat(
      RATING_KEYWORDS.negative.map((k, idx) => ({ ...k, tagId: k.id, type: 'negative', sortOrder: idx }))
    )
  );

  const updatedGroup = {
    ...current,
    [type]: (current[type] || []).filter((t) => t.id !== tagId && t.tagId !== tagId),
  };
  memoryKeywordsStore.set(hotelId, updatedGroup);
  memoryKeywordsStore.set(identifier, updatedGroup);

  await logEvent(hotelId, 'KEYWORD_DELETED', { type, tagId }, req).catch(() => {});
  return { success: true, message: 'Keyword tag deleted successfully.' };
}

export async function updateKeyword(identifier = DEFAULT_HOTEL_ID, type, tagId, tagData, req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  try {
    await Keyword.findOneAndUpdate(
      { hotelId, tagId },
      {
        $set: {
          label: tagData.label,
          category: tagData.category || 'General',
          snippet: tagData.snippet || tagData.label,
          snippets: tagData.snippets || [tagData.snippet || tagData.label],
        },
      },
      { new: true }
    );
  } catch (err) {}

  const current = memoryKeywordsStore.get(hotelId) || groupKeywords(
    RATING_KEYWORDS.positive.map((k, idx) => ({ ...k, tagId: k.id, type: 'positive', sortOrder: idx })).concat(
      RATING_KEYWORDS.negative.map((k, idx) => ({ ...k, tagId: k.id, type: 'negative', sortOrder: idx }))
    )
  );

  const updatedGroup = {
    ...current,
    [type]: (current[type] || []).map((k) => (k.id === tagId || k.tagId === tagId ? { ...k, ...tagData } : k)),
  };
  memoryKeywordsStore.set(hotelId, updatedGroup);
  memoryKeywordsStore.set(identifier, updatedGroup);

  await logEvent(hotelId, 'KEYWORD_UPDATED', { type, tagId, label: tagData.label }, req).catch(() => {});

  return {
    success: true,
    keyword: { id: tagId, ...tagData },
  };
}

export async function reorderKeywords(identifier = DEFAULT_HOTEL_ID, type, tagIds = [], req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const ops = tagIds.map((tagId, index) => ({
    updateOne: {
      filter: { hotelId, tagId },
      update: { $set: { sortOrder: index } },
    },
  }));

  if (ops.length > 0) {
    await Keyword.bulkWrite(ops).catch(() => {});
  }

  await logEvent(hotelId, 'KEYWORD_REORDERED', { type, count: tagIds.length }, req).catch(() => {});
  return { success: true };
}

export async function applyKeywordTemplate(identifier = DEFAULT_HOTEL_ID, templateKey, customKeywords = [], req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  await Keyword.deleteMany({ hotelId, type: 'positive' }).catch(() => {});

  const docs = customKeywords.map((item, idx) => ({
    hotelId,
    type: 'positive',
    tagId: item.id || 'tmpl_' + idx + '_' + Date.now().toString(36),
    label: item.label,
    category: item.category || 'General',
    snippet: item.snippet || item.label,
    snippets: item.snippets || [item.snippet || item.label],
    sortOrder: idx,
    isActive: true,
  }));

  if (docs.length > 0) {
    await Keyword.insertMany(docs).catch(() => {});
  }

  const current = memoryKeywordsStore.get(hotelId) || { positive: [], negative: [] };
  const updatedGroup = {
    ...current,
    positive: customKeywords,
  };
  memoryKeywordsStore.set(hotelId, updatedGroup);
  memoryKeywordsStore.set(identifier, updatedGroup);

  await logEvent(hotelId, 'KEYWORD_TEMPLATE_APPLIED', { templateKey, count: docs.length }, req).catch(() => {});
  return { success: true, count: docs.length };
}
    snippets: item.snippets || [item.snippet || item.label],
    sortOrder: idx,
    isActive: true,
  }));

  if (docs.length > 0) {
    await Keyword.insertMany(docs);
  }

  await logEvent(hotelId, 'KEYWORD_TEMPLATE_APPLIED', { templateKey, count: docs.length }, req);
  return { success: true, count: docs.length };
}
