import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Hotel, Settings, User, Keyword, QrCode, Analytics } from '../models/index.js';
import { logger } from '../utils/logger.js';
import { BCRYPT_SALT_ROUNDS, DEFAULT_ADMIN_PIN } from '../config/constants.js';
import { RATING_KEYWORDS } from '../../src/utils/reviewGenerator.js';
import { INDUSTRY_TEMPLATES } from '../../src/config/industryTemplates.js';
import { generateGoogleReviewUrl } from '../../src/utils/googleReview.js';

import { ensureDbConnected } from '../config/db.js';

export async function getHotel(identifier) {
  if (!identifier) return null;
  await ensureDbConnected();
  const cleanId = String(identifier).toLowerCase().trim();

  if (mongoose.connection.readyState === 1) {
    try {
      const hotel = await Hotel.findOne({
        $or: [{ hotelId: cleanId }, { hotelSlug: cleanId }]
      }).lean();

      if (hotel) return hotel;
    } catch (err) {
      logger.warn(`[HotelService] DB query failed for "${cleanId}": ${err.message}`);
    }
  }

  return null;
}

export async function createHotel(data) {
  const hotelId = String(data.hotelId || data.hotelSlug || '').toLowerCase().trim();
  const hotelSlug = String(data.hotelSlug || hotelId).toLowerCase().trim();
  if (!hotelId) throw new Error('hotelId / hotelSlug is required.');

  let hotel = await Hotel.findOne({ hotelId });
  if (hotel) return hotel;

  hotel = await Hotel.create({
    hotelId,
    hotelSlug,
    name: data.name || hotelSlug,
    logoUrl: data.logoUrl || '',
    themeColor: data.themeColor || '#2563eb',
    googlePlaceId: data.googlePlaceId || '',
    googleReviewUrl: data.googleReviewUrl || (data.googlePlaceId ? generateGoogleReviewUrl(data.googlePlaceId, data.name || '') : generateGoogleReviewUrl('', data.name || '')),
    tripadvisorReviewUrl: data.tripadvisorReviewUrl || 'https://www.tripadvisor.com/UserReview',
    managerEmail: data.managerEmail || '',
    managerPhone: data.managerPhone || '',
    alertThreshold: data.alertThreshold || 3,
    antiGatingNoticeEnabled: true,
    preventDuplicateReviews: true,
    tone: data.tone || 'friendly',
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true },
    ],
  });

  await Settings.create({
    hotel: hotel._id,
    hotelId,
    hotelSlug,
    hotelName: hotel.name,
    logoUrl: hotel.logoUrl,
    themeColor: hotel.themeColor,
    googlePlaceId: hotel.googlePlaceId,
    googleReviewUrl: hotel.googleReviewUrl,
    tripadvisorReviewUrl: hotel.tripadvisorReviewUrl,
    managerEmail: hotel.managerEmail,
    managerPhone: hotel.managerPhone,
    alertThreshold: hotel.alertThreshold,
    preventDuplicateReviews: hotel.preventDuplicateReviews,
    tone: hotel.tone,
    providers: hotel.providers,
  }).catch(() => {});

  logger.info(`[HotelService] Hotel "${hotelId}" (slug: ${hotelSlug}) created successfully.`);
  return hotel;
}

/**
 * Onboard a New Hotel with Universal Atomic Rollback Protection
 */
export async function onboardHotel(data) {
  const name = (data.name || '').trim();
  if (!name) throw new Error('Hotel name is required.');

  let slug = (data.hotelSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
  if (!slug) slug = 'hotel-' + Date.now().toString(36);
  slug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '').replace(/(^-|-$)/g, '');

  const hotelId = slug;
  const googleReviewUrl = data.googleReviewUrl || (data.googlePlaceId ? generateGoogleReviewUrl(data.googlePlaceId) : '');
  const managerEmail = (data.managerEmail || `${hotelId}@jjreviewsystem.com`).toLowerCase().trim();
  const password = data.password || DEFAULT_ADMIN_PIN;

  await ensureDbConnected();
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database connection unavailable. Cannot onboard new hotel without active MongoDB Atlas connection.');
  }

  let existing = await Hotel.findOne({ $or: [{ hotelId }, { hotelSlug: slug }] });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  let createdHotel = null;

  try {
    // 1. Create Hotel Document
    createdHotel = await Hotel.create({
      hotelId,
      hotelSlug: slug,
      name,
      logoUrl: data.logoUrl || '',
      themeColor: data.themeColor || '#2563eb',
      googlePlaceId: data.googlePlaceId || '',
      googleReviewUrl,
      tripadvisorReviewUrl: data.tripadvisorReviewUrl || 'https://www.tripadvisor.com/UserReview',
      managerEmail,
      managerPhone: data.managerPhone || '',
      alertThreshold: data.alertThreshold || 3,
      antiGatingNoticeEnabled: true,
      preventDuplicateReviews: true,
      tone: data.tone || 'friendly',
      providers: [
        { type: 'google', isEnabled: true },
        { type: 'tripadvisor', isEnabled: true },
      ],
    });

    // 2. Create Settings Document
    await Settings.create({
      hotel: createdHotel._id,
      hotelId,
      hotelSlug: slug,
      hotelName: name,
      logoUrl: createdHotel.logoUrl,
      themeColor: createdHotel.themeColor,
      googlePlaceId: createdHotel.googlePlaceId,
      googleReviewUrl: createdHotel.googleReviewUrl,
      tripadvisorReviewUrl: createdHotel.tripadvisorReviewUrl,
      managerEmail,
      managerPhone: createdHotel.managerPhone,
      alertThreshold: createdHotel.alertThreshold,
      preventDuplicateReviews: createdHotel.preventDuplicateReviews,
      tone: createdHotel.tone,
      providers: createdHotel.providers,
    });

    // 3. Create Manager User Document
    const passwordHash = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
    await User.create({
      hotel: createdHotel._id,
      hotelId,
      email: managerEmail,
      passwordHash,
      role: 'owner',
      displayName: data.managerName || 'Hotel Manager',
      tokenVersion: 0,
    });

    // 4. Seed Keywords based on businessType or default
    const docs = [];
    const bType = (data.businessType || 'hotel').toLowerCase();
    const templateObj = INDUSTRY_TEMPLATES[bType] || INDUSTRY_TEMPLATES.hotel;

    if (templateObj && Array.isArray(templateObj.keywords) && templateObj.keywords.length > 0) {
      templateObj.keywords.forEach((item, idx) => {
        docs.push({
          hotel: createdHotel._id,
          hotelId,
          type: 'positive',
          tagId: item.id,
          label: item.label,
          category: item.category || 'General',
          snippet: item.snippet || item.label,
          snippets: item.snippets || [item.snippet || item.label],
          sortOrder: idx,
        });
      });
    } else {
      RATING_KEYWORDS.positive.forEach((item, idx) => {
        docs.push({
          hotel: createdHotel._id,
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
    }

    RATING_KEYWORDS.negative.forEach((item, idx) => {
      docs.push({
        hotel: createdHotel._id,
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

    if (docs.length > 0) {
      await Keyword.insertMany(docs).catch(() => {});
    }
    // 5. Create Default QR Code Record
    await QrCode.create({
      hotel: createdHotel._id,
      hotelId,
      uniqueToken: slug,
      title: `${name} Permanent QR`,
      status: 'active',
    }).catch(() => {});

    // 6. Create Initial Analytics Record
    await Analytics.create({
      hotelId,
      date: new Date(),
      totalReviews: 0,
      avgRating: 0,
    }).catch(() => {});

    logger.info(`🎉 [Master Hotel Registry] Hotel "${name}" (slug: ${slug}) onboarded successfully!`);

    return {
      success: true,
      message: `Hotel "${name}" onboarded successfully!`,
      hotel: {
        id: createdHotel._id.toString(),
        hotelId: createdHotel.hotelId,
        hotelSlug: createdHotel.hotelSlug,
        name: createdHotel.name,
        logoUrl: createdHotel.logoUrl,
        themeColor: createdHotel.themeColor,
        managerEmail,
      },
    };
  } catch (err) {
    logger.error(`❌ [HotelOnboarding Failed] Rolling back creation for hotel "${hotelId}": ${err.message}`);

    // Atomic Rollback Cleanup across all collections
    if (createdHotel) {
      await Promise.all([
        Hotel.deleteOne({ hotelId }),
        Settings.deleteOne({ hotelId }),
        User.deleteMany({ hotelId }),
        Keyword.deleteMany({ hotelId }),
        QrCode.deleteMany({ hotelId }),
        Analytics.deleteMany({ hotelId }),
      ]).catch(() => {});
    }

    throw err;
  }
}

export async function getAllHotels() {
  if (mongoose.connection.readyState !== 1) {
    return [];
  }

  const hotels = await Hotel.find({}).sort({ createdAt: -1, name: 1 }).lean();
  return hotels.map((h) => ({
    id: h._id ? h._id.toString() : h.hotelSlug,
    hotelId: h.hotelId || h.hotelSlug,
    hotelSlug: h.hotelSlug || h.hotelId,
    name: h.name || h.hotelSlug,
    logoUrl: h.logoUrl || '',
    themeColor: h.themeColor || '#2563eb',
    managerEmail: h.managerEmail || '',
  }));
}

export async function updateHotel(hotelId, updateData) {
  const hotel = await Hotel.findOneAndUpdate(
    { hotelId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return hotel;
}

/**
 * Permanently delete a hotel and ALL associated data across every collection.
 */
export async function deleteHotel(identifier) {
  if (!identifier) throw new Error('hotelId or hotelSlug is required to delete a hotel.');

  await ensureDbConnected();
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database connection unavailable. Cannot delete hotel without active MongoDB Atlas connection.');
  }

  const cleanId = String(identifier).toLowerCase().trim();
  const hotel = await Hotel.findOne({
    $or: [{ hotelId: cleanId }, { hotelSlug: cleanId }],
  });

  if (!hotel) {
    throw new Error(`Hotel "${cleanId}" not found. Cannot delete a non-existent hotel.`);
  }

  const hotelId = hotel.hotelId;
  const hotelName = hotel.name;

  // Import remaining models that are not already imported at the top
  const { Feedback } = await import('../models/Feedback.js');
  const { AuditLog } = await import('../models/AuditLog.js');
  const { Notification } = await import('../models/Notification.js');

  // Cascading delete across ALL collections tied to this hotel
  const results = await Promise.allSettled([
    Hotel.deleteOne({ hotelId }),
    Settings.deleteMany({ hotelId }),
    User.deleteMany({ hotelId }),
    Keyword.deleteMany({ hotelId }),
    QrCode.deleteMany({ hotelId }),
    Analytics.deleteMany({ hotelId }),
    Feedback.deleteMany({ hotelId }),
    AuditLog.deleteMany({ hotelId }),
    Notification.deleteMany({ hotelId }),
  ]);

  const failedOps = results.filter((r) => r.status === 'rejected');
  if (failedOps.length > 0) {
    logger.warn(`[HotelService] ${failedOps.length} collection(s) had errors during deletion of "${hotelId}".`);
  }

  logger.info(`🗑️ [HotelService] Hotel "${hotelName}" (${hotelId}) and all associated data permanently deleted.`);

  return {
    success: true,
    message: `Hotel "${hotelName}" and all associated data have been permanently deleted.`,
    deletedHotel: {
      hotelId,
      hotelSlug: hotel.hotelSlug,
      name: hotelName,
    },
  };
}
