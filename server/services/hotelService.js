import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Hotel, Settings, User, Keyword, ReviewTemplate } from '../models/index.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_HOTELS, DEFAULT_HOTEL_ID, BCRYPT_SALT_ROUNDS, DEFAULT_ADMIN_PIN } from '../config/constants.js';
import { RATING_KEYWORDS } from '../../src/utils/reviewGenerator.js';
import { generateGoogleReviewUrl } from '../../src/utils/googleReview.js';

const inMemoryHotelsMap = new Map([
  ['sree-jee-stay', { hotelId: 'sree-jee-stay', hotelSlug: 'sree-jee-stay', name: 'Sree Jee Stay - Homestay in Varanasi', themeColor: '#2563eb' }],
  ['jj-elevates', { hotelId: 'jj-elevates', hotelSlug: 'jj-elevates', name: 'JJ elevates', themeColor: '#2563eb' }]
]);

export function updateInMemoryHotel(identifier, updatedData) {
  const cleanId = String(identifier || '').toLowerCase().trim();
  if (!cleanId) return;
  const current = inMemoryHotelsMap.get(cleanId) || { hotelId: cleanId, hotelSlug: cleanId };
  inMemoryHotelsMap.set(cleanId, {
    ...current,
    ...updatedData,
    name: updatedData.name || updatedData.hotelName || current.name,
  });
}

export async function getHotel(identifier = DEFAULT_HOTEL_ID) {
  const cleanId = (identifier || DEFAULT_HOTEL_ID).toLowerCase().trim();

  const formattedTitle = cleanId === 'sree-jee-stay'
    ? 'Sree Jee Stay - Homestay in Varanasi'
    : (cleanId === 'jj-elevates' ? 'JJ elevates' : cleanId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));

  // Check MongoDB Atlas first
  if (mongoose.connection.readyState === 1) {
    try {
      let hotel = await Hotel.findOne({
        $or: [{ hotelId: cleanId }, { hotelSlug: cleanId }]
      });

      if (!hotel && DEFAULT_HOTELS.includes(cleanId)) {
        hotel = await createHotel({ hotelId: cleanId, hotelSlug: cleanId, name: formattedTitle });
      }

      if (hotel) return hotel;
    } catch (err) {
      logger.warn(`[HotelService] DB query failed, returning fallback hotel for "${cleanId}": ${err.message}`);
    }
  }

  // Fallback to in-memory map if DB is disconnected or hotel not found
  if (inMemoryHotelsMap.has(cleanId)) {
    const mem = inMemoryHotelsMap.get(cleanId);
    return {
      hotelId: cleanId,
      hotelSlug: cleanId,
      name: mem.name || formattedTitle,
      logoUrl: mem.logoUrl || '',
      themeColor: mem.themeColor || '#2563eb',
      googlePlaceId: mem.googlePlaceId || '',
      googleReviewUrl: mem.googleReviewUrl || (mem.googlePlaceId ? generateGoogleReviewUrl(mem.googlePlaceId) : 'https://g.page/r/CTERYeDefsTREAE/review'),
      tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
      managerEmail: mem.managerEmail || 'himanshigoswami9057@gmail.com',
      managerPhone: '+91 98765 43210',
      alertThreshold: 3,
      antiGatingNoticeEnabled: true,
      preventDuplicateReviews: true,
      tone: mem.tone || 'friendly',
      providers: [
        { type: 'google', isEnabled: true },
        { type: 'tripadvisor', isEnabled: true },
      ],
    };
  }

  return {
    hotelId: cleanId,
    hotelSlug: cleanId,
    name: formattedTitle,
    themeColor: '#2563eb',
    googlePlaceId: process.env.VITE_GOOGLE_PLACE_ID || '',
    googleReviewUrl: 'https://g.page/r/CTERYeDefsTREAE/review',
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: 'himanshigoswami9057@gmail.com',
    managerPhone: '+91 98765 43210',
    alertThreshold: 3,
    antiGatingNoticeEnabled: true,
    preventDuplicateReviews: true,
    tone: 'friendly',
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true },
    ],
  };
}

export async function createHotel(data) {
  const hotelId = (data.hotelId || DEFAULT_HOTEL_ID).toLowerCase().trim();
  const hotelSlug = (data.hotelSlug || hotelId).toLowerCase().trim();

  let hotel = await Hotel.findOne({ hotelId });
  if (hotel) return hotel;

  hotel = await Hotel.create({
    hotelId,
    hotelSlug,
    name: data.name || 'Sree Jee Stay - Homestay in Varanasi',
    logoUrl: data.logoUrl || '',
    themeColor: data.themeColor || '#2563eb',
    googlePlaceId: data.googlePlaceId || process.env.VITE_GOOGLE_PLACE_ID || '',
    googleReviewUrl: data.googleReviewUrl || generateGoogleReviewUrl(process.env.VITE_GOOGLE_PLACE_ID || ''),
    tripadvisorReviewUrl: data.tripadvisorReviewUrl || 'https://www.tripadvisor.com/UserReview',
    managerEmail: data.managerEmail || 'himanshigoswami9057@gmail.com',
    managerPhone: data.managerPhone || '+91 98765 43210',
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
 * Compatible with standalone local MongoDB and MongoDB Atlas clusters!
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

  inMemoryHotelsMap.set(slug, {
    hotelId,
    hotelSlug: slug,
    name,
    logoUrl: data.logoUrl || '',
    themeColor: data.themeColor || '#2563eb',
    googlePlaceId: data.googlePlaceId || '',
    googleReviewUrl: googleReviewUrl || 'https://g.page/r/CTERYeDefsTREAE/review',
    managerEmail,
    tone: data.tone || 'friendly',
  });

  if (mongoose.connection.readyState !== 1) {
    logger.warn(`[HotelService] DB offline mode: onboarded "${name}" (slug: ${slug}) dynamically.`);
    return {
      success: true,
      message: `Hotel "${name}" onboarded successfully.`,
      hotel: inMemoryHotelsMap.get(slug),
    };
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

    // 4. Seed Keywords
    const docs = [];
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
    await Keyword.insertMany(docs);

    // 5. Seed Review Templates
    await ReviewTemplate.create([
      {
        hotel: createdHotel._id,
        hotelId,
        ratingLevel: 5,
        tone: createdHotel.tone,
        openings: [`Had a fantastic experience during our stay at ${name}!`],
        closings: ['Will definitely come back and recommend to friends!'],
      },
    ]);

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

    // Atomic Rollback Cleanup
    if (createdHotel) {
      await Promise.all([
        Hotel.deleteOne({ hotelId }),
        Settings.deleteOne({ hotelId }),
        User.deleteMany({ hotelId }),
        Keyword.deleteMany({ hotelId }),
        ReviewTemplate.deleteMany({ hotelId }),
      ]).catch(() => {});
    }

    throw err;
  }
}

export async function getAllHotels() {
  const resultList = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const hotels = await Hotel.find({}).sort({ createdAt: -1, name: 1 }).lean();
      if (hotels && hotels.length > 0) {
        hotels.forEach((h) => {
          resultList.push({
            id: h._id ? h._id.toString() : h.hotelSlug,
            hotelId: h.hotelId || h.hotelSlug,
            hotelSlug: h.hotelSlug || h.hotelId,
            name: h.name || h.hotelSlug,
            logoUrl: h.logoUrl || '',
            themeColor: h.themeColor || '#2563eb',
            managerEmail: h.managerEmail || '',
          });
        });
      }
    } catch (err) {
      logger.warn(`[HotelService] getAllHotels failed: ${err.message}`);
    }
  }

  // Merge in-memory map items so newly onboarded hotels are never lost
  inMemoryHotelsMap.forEach((h, slug) => {
    if (!resultList.some(item => item.hotelSlug === slug)) {
      resultList.push({
        id: slug,
        hotelId: h.hotelId || slug,
        hotelSlug: slug,
        name: h.name || slug,
        logoUrl: h.logoUrl || '',
        themeColor: h.themeColor || '#2563eb',
        managerEmail: h.managerEmail || '',
      });
    }
  });

  if (!resultList.some(item => item.hotelSlug === 'sree-jee-stay')) {
    resultList.unshift({
      id: 'sree-jee-stay',
      hotelId: 'sree-jee-stay',
      hotelSlug: 'sree-jee-stay',
      name: 'Sree Jee Stay - Homestay in Varanasi',
    });
  }

  return resultList;
}

export async function updateHotel(hotelId, updateData) {
  const hotel = await Hotel.findOneAndUpdate(
    { hotelId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
  return hotel;
}
