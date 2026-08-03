import { connectDB } from '../server/config/db.js';
import { getKeywords, applyKeywordTemplate } from '../server/services/settingsService.js';
import { Keyword } from '../server/models/index.js';

async function test() {
  await connectDB();
  console.log('--- Testing Preset & Custom Keyword Saving to MongoDB Atlas ---');

  // Test Marketing Agency preset
  const marketingKeywords = [
    { id: 'leads', label: '🎯 High-Quality Leads', category: 'Lead Generation', snippet: 'Delivered steady leads' },
    { id: 'seo', label: '📈 Top SEO Rankings', category: 'SEO', snippet: 'Improved SEO rankings' },
  ];

  console.log('[Test 1] Saving Marketing Agency preset keywords to jj-elevates...');
  const res1 = await applyKeywordTemplate('jj-elevates', 'marketing', marketingKeywords);
  console.log('[Test 1 Result]:', res1.success, 'Count:', res1.count);

  console.log('[Test 2] Querying MongoDB Atlas for jj-elevates keywords...');
  const kw2 = await getKeywords('jj-elevates');
  console.log('[Test 2 Result] Retrieved positive labels from DB:', kw2.positive.map(k => k.label));

  if (kw2.positive.length !== 2 || kw2.positive[0].label !== '🎯 High-Quality Leads') {
    throw new Error('Failed to persist preset keywords to MongoDB Atlas!');
  }

  // Test Hotel preset
  const hotelKeywords = [
    { id: 'clean', label: '✨ Spotless Room', category: 'Cleanliness', snippet: 'Spotless room' },
    { id: 'wifi', label: '⚡ Fast Wi-Fi', category: 'Amenities', snippet: 'Fast wifi' },
  ];

  console.log('[Test 3] Saving Hotel preset keywords back to jj-elevates...');
  const res3 = await applyKeywordTemplate('jj-elevates', 'hotel', hotelKeywords);
  console.log('[Test 3 Result]:', res3.success, 'Count:', res3.count);

  const kw3 = await getKeywords('jj-elevates');
  console.log('[Test 3 Result] Retrieved positive labels from DB:', kw3.positive.map(k => k.label));

  console.log('\n🎉 ALL PRESET & KEYWORD MONGO DB SAVING TESTS PASSED!');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
