import { connectDB } from '../server/config/db.js';
import { logScanEvent } from '../server/services/qrService.js';
import { getHotel } from '../server/services/hotelService.js';

async function test() {
  await connectDB();
  console.log('--- Testing QR Token & Slug Resolution Engine ---');

  const testCases = ['jj-elevates', 'sree-jee-stay', 'demo', 'custom-salon-123'];

  for (const slug of testCases) {
    const fakeReq = { headers: { 'user-agent': 'Mozilla/5.0 (iPhone)', 'x-forwarded-for': '192.168.1.50' }, socket: {} };
    const res = await logScanEvent(slug, fakeReq);
    console.log(`[Input: "${slug}"] → Resolved targetSlug: "${res.hotelSlug}" (hotelId: "${res.hotelId}", name: "${res.hotelName}")`);
    
    if (res.hotelSlug !== slug) {
      throw new Error(`❌ Test Failed for "${slug}": Expected "${slug}", got "${res.hotelSlug}"!`);
    }
  }

  console.log('\n🎉 ALL QR SCAN TARGET RESOLUTION TESTS PASSED! No default overrides!');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
