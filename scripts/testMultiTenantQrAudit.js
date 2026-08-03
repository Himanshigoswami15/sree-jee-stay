import { connectDB } from '../server/config/db.js';
import { onboardHotel, getHotel } from '../server/services/hotelService.js';
import { getSettings, updateSettings } from '../server/services/settingsService.js';
import { logScanEvent } from '../server/services/qrService.js';
import { getActiveProviders } from '../src/utils/providerRouter.js';

async function runAudit() {
  await connectDB();
  console.log('==================================================');
  console.log('  MULTI-TENANT PERSISTENCE & QR REDIRECTION AUDIT  ');
  console.log('==================================================\n');

  const timestamp = Date.now().toString(36);
  const hotelA_Slug = `hotel-alpha-${timestamp}`;
  const hotelB_Slug = `hotel-beta-${timestamp}`;

  // 1. Create Hotel A
  console.log('[Step 1] Onboarding Hotel A (hotel-alpha-test)...');
  await onboardHotel({
    name: 'Hotel Alpha Suites',
    hotelSlug: hotelA_Slug,
    googlePlaceId: 'ChIJ_alpha_place_id_123',
    password: '9008',
  });
  await updateSettings(hotelA_Slug, {
    hotelName: 'Hotel Alpha Suites',
    googlePlaceId: 'ChIJ_alpha_place_id_123',
    themeColor: '#e11d48',
  });

  // 2. Create Hotel B
  console.log('[Step 2] Onboarding Hotel B (hotel-beta-test)...');
  await onboardHotel({
    name: 'Hotel Beta Luxury',
    hotelSlug: hotelB_Slug,
    googlePlaceId: 'ChIJ_beta_place_id_456',
    password: '9008',
  });
  await updateSettings(hotelB_Slug, {
    hotelName: 'Hotel Beta Luxury',
    googlePlaceId: 'ChIJ_beta_place_id_456',
    themeColor: '#059669',
  });

  // 3. Verify Device B query for Hotel A
  console.log('\n[Step 3] Simulating Device B querying Hotel A from MongoDB Atlas...');
  const settingsA = await getSettings(hotelA_Slug);
  const googleUrlA = settingsA.googleReviewUrl;

  console.log(`  Hotel A Name: "${settingsA.hotelName}"`);
  console.log(`  Hotel A Place ID: "${settingsA.googlePlaceId}"`);
  console.log(`  Hotel A Google URL: "${googleUrlA}"`);

  // 4. Verify Device B query for Hotel B
  console.log('\n[Step 4] Simulating Device B querying Hotel B from MongoDB Atlas...');
  const settingsB = await getSettings(hotelB_Slug);
  const googleUrlB = settingsB.googleReviewUrl;

  console.log(`  Hotel B Name: "${settingsB.hotelName}"`);
  console.log(`  Hotel B Place ID: "${settingsB.googlePlaceId}"`);
  console.log(`  Hotel B Google URL: "${googleUrlB}"`);

  // Assert isolation
  if (settingsA.hotelName !== 'Hotel Alpha Suites' || settingsB.hotelName !== 'Hotel Beta Luxury') {
    throw new Error('❌ Data persistence or multi-tenant isolation failed!');
  }

  if (settingsA.googlePlaceId === settingsB.googlePlaceId || googleUrlA === googleUrlB) {
    throw new Error('❌ Hotel A and Hotel B share the same Google Place ID or Review URL!');
  }

  // 5. Test QR Code Scan Redirection
  console.log('\n[Step 5] Testing QR Code Scan Redirection...');
  const scanReqA = { headers: { 'user-agent': 'iPhone Mobile' }, socket: {} };
  const scanReqB = { headers: { 'user-agent': 'Android Mobile' }, socket: {} };

  const qrResultA = await logScanEvent(hotelA_Slug, scanReqA);
  const qrResultB = await logScanEvent(hotelB_Slug, scanReqB);

  console.log(`  QR Scan A -> Target Slug: "${qrResultA.hotelSlug}" (Expected: "${hotelA_Slug}")`);
  console.log(`  QR Scan B -> Target Slug: "${qrResultB.hotelSlug}" (Expected: "${hotelB_Slug}")`);

  if (qrResultA.hotelSlug !== hotelA_Slug || qrResultB.hotelSlug !== hotelB_Slug) {
    throw new Error('❌ QR Code scan redirection is opening the wrong/shared hotel link!');
  }

  console.log('\n==================================================');
  console.log(' 🎉 ALL AUDIT & INTEGRATION TESTS PASSED 100%! ');
  console.log('==================================================\n');

  process.exit(0);
}

runAudit().catch(err => {
  console.error('❌ Audit Failed:', err);
  process.exit(1);
});
