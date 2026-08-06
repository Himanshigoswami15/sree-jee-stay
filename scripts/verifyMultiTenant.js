import mongoose from 'mongoose';
import { onboardHotel } from '../server/services/hotelService.js';
import { logScanEvent } from '../server/services/qrService.js';
import { Feedback, Hotel, Settings, Keyword, QRScan, User } from '../server/models/index.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jjreview:JJelevate@cluster0.xiitj9c.mongodb.net/jj_review_system?retryWrites=true&w=majority&appName=Cluster0';

async function verify() {
  console.log('🧪 Starting Multi-Tenant Isolation & QR Routing Verification...\n');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas.');

  const testHotels = [
    { name: 'Hotel Alpha', hotelSlug: 'hotel-alpha', googlePlaceId: 'ChIJHotelAlphaPlaceId1' },
    { name: 'Hotel Beta', hotelSlug: 'hotel-beta', googlePlaceId: 'ChIJHotelBetaPlaceId2' },
    { name: 'Hotel Gamma', hotelSlug: 'hotel-gamma', googlePlaceId: 'ChIJHotelGammaPlaceId3' },
  ];

  // 1. Clean previous test entries
  const slugs = testHotels.map(h => h.hotelSlug);
  await Hotel.deleteMany({ $or: [{ hotelSlug: { $in: slugs } }, { hotelId: { $in: slugs } }] });
  await Settings.deleteMany({ $or: [{ hotelSlug: { $in: slugs } }, { hotelId: { $in: slugs } }] });
  await User.deleteMany({ $or: [{ hotelSlug: { $in: slugs } }, { hotelId: { $in: slugs } }] });
  await Feedback.deleteMany({ $or: [{ hotelSlug: { $in: slugs } }, { hotelId: { $in: slugs } }] });
  await Keyword.deleteMany({ $or: [{ hotelSlug: { $in: slugs } }, { hotelId: { $in: slugs } }] });
  await QRScan.deleteMany({ $or: [{ hotelSlug: { $in: slugs } }, { hotelId: { $in: slugs } }] });

  // 2. Onboard all 3 hotels
  console.log('\n--- 1. Onboarding 3 Hotels ---');
  for (const h of testHotels) {
    const res = await onboardHotel({
      name: h.name,
      hotelSlug: h.hotelSlug,
      googlePlaceId: h.googlePlaceId,
      pin: '1234',
    });
    console.log(`✅ Onboarded: "${res.hotel.name}" -> /r/${res.hotel.hotelSlug}`);
  }

  // 3. Add isolated feedbacks for each hotel
  console.log('\n--- 2. Submitting Isolated Feedbacks ---');
  for (const h of testHotels) {
    await Feedback.create({
      hotelId: h.hotelSlug,
      hotelSlug: h.hotelSlug,
      rating: 5,
      tags: ['Clean Rooms', h.name + ' Staff'],
      reviewText: `Excellent stay at ${h.name}!`,
      guestContact: `9999000${testHotels.indexOf(h)}`,
      postedPublic: true,
    });
    console.log(`✅ Submitted feedback for "${h.name}"`);
  }

  // 4. Test QR Resolution & 404 Validation
  console.log('\n--- 3. Testing QR Resolution & 404 Validation ---');
  const mockReq = { headers: { 'user-agent': 'Mozilla/5.0 (iPhone)' }, socket: { remoteAddress: '127.0.0.1' } };

  for (const h of testHotels) {
    const scanResult = await logScanEvent(h.hotelSlug, mockReq);
    if (scanResult && scanResult.hotelSlug === h.hotelSlug) {
      console.log(`✅ QR Scan Resolution Passed for /r/${h.hotelSlug} -> Target Slug: "${scanResult.hotelSlug}"`);
    } else {
      console.error(`❌ QR Scan Failed for /r/${h.hotelSlug}`);
      process.exit(1);
    }
  }

  const invalidScan = await logScanEvent('invalid-non-existent-hotel-999', mockReq);
  if (invalidScan === null) {
    console.log('✅ 404 Validation Passed: Non-existent slug returns null (triggers 404 response).');
  } else {
    console.error('❌ 404 Validation Failed: Non-existent slug did not return null.');
    process.exit(1);
  }

  // 5. Test Zero Cross-Tenant Data Leakage
  console.log('\n--- 4. Verifying Cross-Tenant Isolation ---');
  for (const h of testHotels) {
    const feedbacks = await Feedback.find({ hotelId: h.hotelSlug }).lean();
    console.log(`Hotel "${h.hotelSlug}": Found ${feedbacks.length} feedback(s).`);
    const leaked = feedbacks.some(f => !f.reviewText.includes(h.name));
    if (leaked || feedbacks.length !== 1) {
      console.error(`❌ Cross-Tenant Leak or Missing Feedback Detected for ${h.hotelSlug}!`);
      process.exit(1);
    }
  }
  console.log('✅ Zero Cross-Tenant Data Leakage Confirmed across all 3 hotels!');

  console.log('\n🎉 ALL 5 MULTI-TENANT VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
  await mongoose.disconnect();
}

verify().catch((err) => {
  console.error('❌ Verification script error:', err);
  process.exit(1);
});
