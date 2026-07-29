import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../server/config/db.js';
import { Hotel, User, Settings, Keyword, ReviewTemplate } from '../server/models/index.js';
import { BCRYPT_SALT_ROUNDS, DEFAULT_ADMIN_PIN } from '../server/config/constants.js';
import { RATING_KEYWORDS } from '../src/utils/reviewGenerator.js';

dotenv.config();

async function runMigration() {
  console.log('\n🚀 --- JJ REVIEW SYSTEM MONGODB MIGRATION SCRIPT ---');
  await connectDB();

  const hotelList = [
    { hotelId: 'sree-jee-stay', hotelSlug: 'sree-jee-stay', name: 'Sree Jee Stay - Homestay in Varanasi' },
    { hotelId: 'demo', hotelSlug: 'demo', name: 'Sree Jee Stay - Homestay in Varanasi' },
  ];

  for (const hotelInfo of hotelList) {
    const { hotelId, hotelSlug, name } = hotelInfo;
    console.log(`\n📌 Processing hotel: "${hotelId}" (slug: ${hotelSlug})...`);

    // 1. Hotel Record
    let hotel = await Hotel.findOne({ hotelId });
    if (!hotel) {
      hotel = await Hotel.create({
        hotelId,
        hotelSlug,
        name,
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
        reviewLength: 'short',
        includeEmojis: true,
        mentionStaff: true,
        mentionCleanliness: true,
        mentionFood: true,
        mentionLocation: true,
        customPrompt: 'Write genuine, human-sounding reviews highlighting room cleanliness and warm staff hospitality.',
        footerText: '',
        language: 'en',
        providers: [
          { type: 'google', isEnabled: true },
          { type: 'tripadvisor', isEnabled: true },
        ],
      });
      console.log(`  ✅ Hotel record created.`);
    } else {
      console.log(`  ℹ️ Hotel record already exists.`);
    }

    // 2. Settings Record
    let settings = await Settings.findOne({ hotelId });
    if (!settings) {
      settings = await Settings.create({
        hotelId,
        hotelSlug,
        hotelName: hotel.name,
        themeColor: hotel.themeColor,
        googlePlaceId: hotel.googlePlaceId,
        googleReviewUrl: hotel.googleReviewUrl,
        tripadvisorReviewUrl: hotel.tripadvisorReviewUrl,
        managerEmail: hotel.managerEmail,
        managerPhone: hotel.managerPhone,
        alertThreshold: hotel.alertThreshold,
        preventDuplicateReviews: hotel.preventDuplicateReviews,
        tone: hotel.tone,
        reviewLength: hotel.reviewLength || 'short',
        includeEmojis: hotel.includeEmojis !== false,
        mentionStaff: hotel.mentionStaff !== false,
        mentionCleanliness: hotel.mentionCleanliness !== false,
        mentionFood: hotel.mentionFood !== false,
        mentionLocation: hotel.mentionLocation !== false,
        customPrompt: hotel.customPrompt || 'Write genuine, human-sounding reviews highlighting room cleanliness and warm staff hospitality.',
        footerText: hotel.footerText || '',
        language: hotel.language || 'en',
        providers: hotel.providers,
      });
      console.log(`  ✅ Settings record created.`);
    } else {
      console.log(`  ℹ️ Settings record already exists.`);
    }

    // 3. User Record (Hotel Manager / Owner)
    let user = await User.findOne({ hotelId });
    if (!user) {
      const hash = bcrypt.hashSync(DEFAULT_ADMIN_PIN, BCRYPT_SALT_ROUNDS);
      user = await User.create({
        hotelId,
        email: `${hotelId}@jjreviewsystem.com`,
        passwordHash: hash,
        role: 'owner',
        displayName: 'Hotel Manager',
      });
      console.log(`  ✅ Default User account created (PIN: 1234).`);
    } else {
      console.log(`  ℹ️ User account already exists.`);
    }

    // 4. Keywords
    const existingKeywords = await Keyword.countDocuments({ hotelId });
    if (existingKeywords === 0) {
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

      await Keyword.insertMany(docs);
      console.log(`  ✅ Seeded ${docs.length} keyword tags.`);
    } else {
      console.log(`  ℹ️ ${existingKeywords} keywords already exist.`);
    }

    // 5. Review Templates
    const existingTemplates = await ReviewTemplate.countDocuments({ hotelId });
    if (existingTemplates === 0) {
      await ReviewTemplate.create([
        {
          hotelId,
          ratingLevel: 5,
          tone: 'friendly',
          openings: [
            `Had a fantastic experience during our stay at ${name}!`,
            `Highly recommend ${name}! Outstanding hospitality and great memories.`,
          ],
          closings: ['Will definitely come back and recommend to friends!'],
        },
      ]);
      console.log(`  ✅ Seeded review templates.`);
    }
  }

  console.log('\n🎉 --- JJ REVIEW SYSTEM MIGRATION COMPLETED SUCCESSFULLY --- \n');
  await disconnectDB();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
