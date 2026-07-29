import bcrypt from 'bcryptjs';
import { Hotel, Settings, User, Keyword, ReviewTemplate } from '../models/index.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_HOTELS, DEFAULT_HOTEL_ID, BCRYPT_SALT_ROUNDS, DEFAULT_ADMIN_PIN } from '../config/constants.js';
import { RATING_KEYWORDS } from '../../src/utils/reviewGenerator.js';
import { generateGoogleReviewUrl } from '../../src/utils/googleReview.js';

export async function getHotel(identifier = DEFAULT_HOTEL_ID) {
  const cleanId = (identifier || DEFAULT_HOTEL_ID).toLowerCase().trim();

  try {
    let hotel = await Hotel.findOne({
      $or: [{ hotelId: cleanId }, { hotelSlug: cleanId }]
    });

    if (!hotel && DEFAULT_HOTELS.includes(cleanId)) {
      hotel = await createHotel({ hotelId: cleanId, hotelSlug: cleanId, name: 'Sree Jee Stay - Homestay in Varanasi' });
    }

    if (hotel) return hotel;
  } catch (err) {
    logger.warn(`[HotelService] DB query failed, returning fallback hotel for "${cleanId}": ${err.message}`);
  }

  return {
    hotelId: cleanId,
    hotelSlug: cleanId,
    name: 'Sree Jee Stay - Homestay in Varanasi',
    themeColor: '#2563eb',
    googlePlaceId: process.env.VITE_GOOGLE_PLACE_ID || 'https://g.page/r/CTERYeDefsTREAE/review',
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

  const hotelId = slug;

  let existing = await Hotel.findOne({ $or: [{ hotelId }, { hotelSlug: slug }] });
  if (existing) {
    throw new Error(`A hotel with slug "${slug}" already exists. Please choose a different slug.`);
  }

  const googleReviewUrl = data.googleReviewUrl || (data.googlePlaceId ? generateGoogleReviewUrl(data.googlePlaceId) : '');
  const managerEmail = (data.managerEmail || `${hotelId}@jjreviewsystem.com`).toLowerCase().trim();
  const password = data.password || DEFAULT_ADMIN_PIN;

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
  const hotels = await Hotel.find({}).sort({ name: 1 });
  return hotels.map((h) => ({
    id: h._id.toString(),
    hotelId: h.hotelId,
    hotelSlug: h.hotelSlug,
    name: h.name,
    logoUrl: h.logoUrl || '',
    themeColor: h.themeColor || '#2563eb',
    managerEmail: h.managerEmail,
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
