import { connectDB } from '../server/config/db.js';
import { updateSettings } from '../server/services/settingsService.js';
import { Hotel, Settings } from '../server/models/index.js';

const JJ_ELEVATE_MAPS_URL = 'https://www.google.com/maps/place/JJ+Elevate+%7C+Digital+Marketing+Agency+%7C+Branding+%7C+Advertising+%7C+Jodhpur/data=!4m2!3m1!1s0x39418c3539828e83:0x1b5a5db7f568a867?sa=X&ved=1t:2428&ictx=111';

async function run() {
  await connectDB();
  console.log('--- Setting Direct Review Link for JJ Elevate ---');

  // Update MongoDB Atlas Settings and Hotel documents for jj-elevates
  const result = await updateSettings('jj-elevates', {
    hotelName: 'JJ Elevate',
    googlePlaceId: JJ_ELEVATE_MAPS_URL,
    googleReviewUrl: JJ_ELEVATE_MAPS_URL,
    themeColor: '#2563eb',
  });

  // Also update Hotel collection directly
  await Hotel.updateMany(
    { $or: [{ hotelId: 'jj-elevates' }, { hotelSlug: 'jj-elevates' }] },
    {
      $set: {
        name: 'JJ Elevate',
        googlePlaceId: JJ_ELEVATE_MAPS_URL,
        googleReviewUrl: JJ_ELEVATE_MAPS_URL,
      }
    }
  );

  console.log('✅ Successfully updated JJ Elevate review link to:', JJ_ELEVATE_MAPS_URL);
  console.log('Settings object returned:', result.settings);

  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error updating JJ Elevate link:', err);
  process.exit(1);
});
