import { connectDB } from '../server/config/db.js';
import { getHotel } from '../server/services/hotelService.js';
import { getKeywords } from '../server/services/settingsService.js';
import { Keyword } from '../server/models/index.js';

async function test() {
  await connectDB();
  console.log('--- Inspecting MongoDB Keywords Collection ---');

  const allDbKeywords = await Keyword.find({});
  console.log(`Total Keyword documents in MongoDB: ${allDbKeywords.length}`);
  
  const hotelsToTest = ['sree-jee-stay', 'jj-elevates', 'demo'];

  for (const slug of hotelsToTest) {
    const hotel = await getHotel(slug);
    const kw = await getKeywords(slug);
    console.log(`\n[Hotel: ${slug}] (hotelId: ${hotel?.hotelId})`);
    console.log(`Positive keywords count: ${kw.positive?.length}`);
    console.log(`Positive keyword labels:`, kw.positive?.map(k => k.label));
  }

  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
