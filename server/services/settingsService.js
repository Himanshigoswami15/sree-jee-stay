import mongoose from 'mongoose';
import { Settings, Keyword, Hotel } from '../models/index.js';
import { getHotel, updateInMemoryHotel } from './hotelService.js';
import { logEvent } from './auditService.js';
import { RATING_KEYWORDS } from '../../src/utils/reviewGenerator.js';
import { generateGoogleReviewUrl } from '../../src/utils/googleReview.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';
import { connectDB } from '../config/db.js';
import { logger } from '../utils/logger.js';
import { broadcastSystemEvent } from '../utils/eventBroadcaster.js';

const memorySettingsStore = new Map();
const memoryKeywordsStore = new Map();

export async function getSettings(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;
  const hotelSlug = hotel ? (hotel.hotelSlug || hotelId) : identifier;

  const fallbackSettings = {
    hotelId,
    hotelSlug,
    hotelName: hotel ? hotel.name : 'Sree Jee Stay - Homestay in Varanasi',
    logoUrl: hotel ? hotel.logoUrl : '',
    themeColor: hotel ? hotel.themeColor : '#2563eb',
    googlePlaceId: hotel ? hotel.googlePlaceId : (process.env.VITE_GOOGLE_PLACE_ID || ''),
    googleReviewUrl: hotel ? hotel.googleReviewUrl : 'https://g.page/r/CTERYeDefsTREAE/review',
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: hotel ? (hotel.managerEmail || 'himanshigoswami9057@gmail.com') : 'himanshigoswami9057@gmail.com',
    managerPhone: hotel ? (hotel.managerPhone || '+91 98765 43210') : '+91 98765 43210',
    alertThreshold: 3,
    preventDuplicateReviews: true,
    tone: hotel ? (hotel.tone || 'friendly') : 'friendly',
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true },
    ],
  };

  if (mongoose.connection.readyState !== 1) {
    await connectDB(1, 500).catch(() => {});
  }

  if (mongoose.connection.readyState !== 1) {
    if (memorySettingsStore.has(hotelId)) return memorySettingsStore.get(hotelId);
    if (memorySettingsStore.has(hotelSlug)) return memorySettingsStore.get(hotelSlug);
    if (memorySettingsStore.has(identifier)) return memorySettingsStore.get(identifier);
    return fallbackSettings;
  }

  try {
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
        managerEmail: hotel ? (hotel.managerEmail || 'himanshigoswami9057@gmail.com') : 'himanshigoswami9057@gmail.com',
        managerPhone: hotel ? (hotel.managerPhone || '+91 98765 43210') : '+91 98765 43210',
        alertThreshold: 3,
        preventDuplicateReviews: true,
        tone: hotel ? (hotel.tone || 'friendly') : 'friendly',
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
  const hotelId = current.hotelId || identifier;
  const hotelSlug = current.hotelSlug || identifier;
  const updatedData = { ...current, ...newSettings };

  if (newSettings.googlePlaceId && (!newSettings.googleReviewUrl || newSettings.googleReviewUrl === current.googleReviewUrl)) {
    updatedData.googleReviewUrl = generateGoogleReviewUrl(newSettings.googlePlaceId);
  } else if (newSettings.googleReviewUrl) {
    updatedData.googleReviewUrl = generateGoogleReviewUrl(newSettings.googleReviewUrl);
  }

  let settings = null;
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB(1, 500).catch(() => {});
    }
    if (mongoose.connection.readyState === 1) {
      settings = await Settings.findOne({
        $or: [{ hotelId }, { hotelSlug }, { hotelId: identifier }, { hotelSlug: identifier }]
      });
      if (settings) {
        Object.assign(settings, updatedData);
        settings = await settings.save();
      } else {
        settings = await Settings.create({ ...updatedData, hotelId, hotelSlug });
      }

      // Sync with Hotel model in MongoDB
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
    }
  } catch (err) {
    logger.warn(`[SettingsService] MongoDB updateSettings error: ${err.message}`);
  }

  await logEvent(hotelId, 'SETTINGS_UPDATED', newSettings, req).catch(() => {});

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
  memorySettingsStore.set(hotelSlug, resultSettings);
  memorySettingsStore.set(identifier, resultSettings);
  updateInMemoryHotel(hotelSlug, resultSettings);
  updateInMemoryHotel(hotelId, resultSettings);

  // Broadcast real-time SSE event to all connected devices across the network
  broadcastSystemEvent(hotelSlug, 'SETTINGS_UPDATED', { settings: resultSettings });

  return {
    success: true,
    message: 'Settings updated successfully.',
    settings: resultSettings,
  };
}

export async function getKeywords(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  try {
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
      if (seeded.length > 0) {
        const grouped = groupKeywords(seeded);
        memoryKeywordsStore.set(hotelId, grouped);
        memoryKeywordsStore.set(identifier, grouped);
        return grouped;
      }
    } else {
      const grouped = groupKeywords(keywords);
      memoryKeywordsStore.set(hotelId, grouped);
      memoryKeywordsStore.set(identifier, grouped);
      return grouped;
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
  const tagId = tagData.tagId || tagData.id || 'custom_' + Date.now().toString(36);

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
      sortOrder: Date.now(),
      isActive: true,
    });
    newKw = {
      id: keyword.tagId,
      tagId: keyword.tagId,
      label: keyword.label,
      category: keyword.category,
      snippet: keyword.snippet,
      snippets: keyword.snippets,
    };
  } catch (err) {
    logger.error(`[SettingsService] Error adding keyword for "${identifier}": ${err.message}`);
  }

  memoryKeywordsStore.delete(hotelId);
  memoryKeywordsStore.delete(identifier);
  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_ADDED', { type, label: tagData.label }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });

  return {
    success: true,
    keyword: newKw,
    keywords: updatedGroup,
  };
}

export async function deleteKeyword(identifier = DEFAULT_HOTEL_ID, type, tagId, req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  try {
    await Keyword.deleteMany({
      $or: [{ hotelId }, { hotelId: identifier }],
      tagId,
    });
  } catch (err) {
    logger.error(`[SettingsService] Error deleting keyword "${tagId}" for "${identifier}": ${err.message}`);
  }

  memoryKeywordsStore.delete(hotelId);
  memoryKeywordsStore.delete(identifier);
  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_DELETED', { type, tagId }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });
  return { success: true, message: 'Keyword tag deleted successfully.', keywords: updatedGroup };
}

export async function updateKeyword(identifier = DEFAULT_HOTEL_ID, type, tagId, tagData, req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  try {
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
  } catch (err) {
    logger.error(`[SettingsService] Error updating keyword "${tagId}" for "${identifier}": ${err.message}`);
  }

  memoryKeywordsStore.delete(hotelId);
  memoryKeywordsStore.delete(identifier);
  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_UPDATED', { type, tagId, label: tagData.label }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });

  return {
    success: true,
    keyword: { id: tagId, tagId, ...tagData },
    keywords: updatedGroup,
  };
}

export async function reorderKeywords(identifier = DEFAULT_HOTEL_ID, type, tagIds = [], req = null) {
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

  memoryKeywordsStore.delete(hotelId);
  memoryKeywordsStore.delete(identifier);

  await logEvent(hotelId, 'KEYWORD_REORDERED', { type, count: tagIds.length }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED');
  return { success: true };
}

export async function applyKeywordTemplate(identifier = DEFAULT_HOTEL_ID, templateKey, customKeywords = [], req = null) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  try {
    await Keyword.deleteMany({
      $or: [{ hotelId }, { hotelId: identifier }]
    });

    const docs = customKeywords.map((item, idx) => ({
      hotelId,
      type: 'positive',
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
  } catch (err) {
    logger.error(`[SettingsService] Error applying keyword template for "${identifier}": ${err.message}`);
  }

  memoryKeywordsStore.delete(hotelId);
  memoryKeywordsStore.delete(identifier);
  const updatedGroup = await getKeywords(identifier);

  await logEvent(hotelId, 'KEYWORD_TEMPLATE_APPLIED', { templateKey, count: customKeywords.length }, req).catch(() => {});
  broadcastSystemEvent(hotelId, 'KEYWORDS_UPDATED', { keywords: updatedGroup });
  return { success: true, count: customKeywords.length, keywords: updatedGroup };
}
