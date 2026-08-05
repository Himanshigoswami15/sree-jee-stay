import mongoose from 'mongoose';
import { Hotel, Settings } from '../server/models/index.js';
import { generateGoogleReviewUrl } from '../src/utils/googleReview.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jjreview:JJelevate@cluster0.xiitj9c.mongodb.net/jj_review_system?retryWrites=true&w=majority&appName=Cluster0';

async function fix() {
  console.log('🔧 Inspecting & fixing MongoDB Atlas Hotel & Settings review URLs...\n');
  await mongoose.connect(MONGODB_URI);

  const hotels = await Hotel.find({});
  console.log(`Found ${hotels.length} hotel(s) in Atlas.`);

  for (const h of hotels) {
    const slug = h.hotelSlug || h.hotelId;
    const name = h.name || slug;
    console.log(`Checking "${name}" (slug: ${slug})...`);
    console.log(`  Current googlePlaceId: "${h.googlePlaceId}"`);
    console.log(`  Current googleReviewUrl: "${h.googleReviewUrl}"`);

    const isSreeJeeStay = slug === 'sree-jee-stay';
    const isLegacySreeLink = (h.googleReviewUrl || '').includes('CTERYeDefsTREAE');

    if (!isSreeJeeStay && isLegacySreeLink) {
      console.log(`  ⚠️ Found legacy Sree Jee Stay link in "${slug}". Cleaning...`);
      const newUrl = generateGoogleReviewUrl(h.googlePlaceId && !h.googlePlaceId.includes('CTERYeDefsTREAE') ? h.googlePlaceId : '', name);
      
      h.googleReviewUrl = newUrl;
      if (h.googlePlaceId && h.googlePlaceId.includes('CTERYeDefsTREAE')) {
        h.googlePlaceId = '';
      }
      await h.save();

      await Settings.updateMany(
        { $or: [{ hotelId: slug }, { hotelSlug: slug }] },
        {
          $set: {
            googleReviewUrl: newUrl,
            googlePlaceId: h.googlePlaceId,
          }
        }
      );
      console.log(`  ✅ Updated "${slug}" to URL: "${newUrl}"`);
    } else {
      console.log(`  ✅ URL is valid for "${slug}".`);
    }
  }

  console.log('\n🎉 Mongo Atlas review URLs sanitized successfully!');
  await mongoose.disconnect();
}

fix().catch((err) => {
  console.error('❌ Error fixing Atlas URLs:', err);
  process.exit(1);
});
