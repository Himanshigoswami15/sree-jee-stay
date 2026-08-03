import { connectDB } from '../server/config/db.js';
import { getSettings, updateSettings, getKeywords, applyKeywordTemplate } from '../server/services/settingsService.js';
import { getHotel } from '../server/services/hotelService.js';

async function test() {
  await connectDB();
  console.log('--- Testing Cross-Device MongoDB Atlas Persistence ---');

  const testSlug = 'jj-elevates';

  console.log('\n[Device A Sim] Saving new Business Profile to MongoDB Atlas...');
  const saveRes = await updateSettings(testSlug, {
    hotelName: 'JJ Elevate',
    googlePlaceId: 'https://www.google.com/maps/place/JJ+Elevate',
    themeColor: '#1d4ed8',
  });
  console.log('[Device A Result]: Saved name ->', saveRes.settings?.hotelName || saveRes.hotelName);

  console.log('\n[Device B Sim] Querying MongoDB Atlas from another device/session...');
  const dbSettings = await getSettings(testSlug);
  const dbHotel = await getHotel(testSlug);

  console.log('[Device B Result] getSettings name from DB:', dbSettings.hotelName);
  console.log('[Device B Result] getHotel name from DB:', dbHotel.name);

  if (dbSettings.hotelName !== 'JJ Elevate' || dbHotel.name !== 'JJ Elevate') {
    throw new Error('❌ FAILURE: MongoDB Atlas did not return updated business profile for Device B!');
  }

  console.log('\n🎉 SUCCESS! MongoDB Atlas cross-device persistence is 100% verified!');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
