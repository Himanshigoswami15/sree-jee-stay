import { getHotel } from '../server/services/hotelService.js';
import { getSettings, updateSettings } from '../server/services/settingsService.js';

async function test() {
  console.log('--- Testing Hotel Context & Settings Isolation ---');

  // Test 1: getHotel for jj-elevates
  const jjHotel = await getHotel('jj-elevates');
  console.log('[Test 1] getHotel("jj-elevates"):', jjHotel.name, jjHotel.hotelSlug);
  if (jjHotel.hotelSlug !== 'jj-elevates') throw new Error('Failed to get jj-elevates hotel');

  // Test 2: getSettings for jj-elevates
  const jjSettings = await getSettings('jj-elevates');
  console.log('[Test 2] getSettings("jj-elevates"):', jjSettings.hotelName, jjSettings.hotelSlug);
  if (jjSettings.hotelSlug !== 'jj-elevates') throw new Error('Failed to get jj-elevates settings');

  // Test 3: updateSettings for jj-elevates
  const updated = await updateSettings('jj-elevates', { hotelName: 'JJ Elevates Luxury Suites', managerPhone: '+91 99999 88888' });
  console.log('[Test 3] updateSettings("jj-elevates"):', updated.settings.hotelName, updated.settings.managerPhone);
  if (updated.settings.hotelName !== 'JJ Elevates Luxury Suites' || updated.settings.hotelSlug !== 'jj-elevates') {
    throw new Error('Failed to update jj-elevates settings cleanly');
  }

  // Test 4: Verify sree-jee-stay was NOT touched
  const sreeSettings = await getSettings('sree-jee-stay');
  console.log('[Test 4] getSettings("sree-jee-stay"):', sreeSettings.hotelName, sreeSettings.hotelSlug);
  if (sreeSettings.hotelSlug !== 'sree-jee-stay' || sreeSettings.hotelName === 'JJ Elevates Luxury Suites') {
    throw new Error('Isolation leak detected: sree-jee-stay settings were overwritten');
  }

  console.log('\n🎉 ALL ISOLATION & SETTINGS TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ Test error:', err);
  process.exit(1);
});
