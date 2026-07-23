import fs from 'fs';
import path from 'path';

/**
 * ==============================================================================
 * GOOGLE PLACE ID VALIDATION SCRIPT
 * ==============================================================================
 * 
 * CRITICAL REMINDER / VERIFICATION CHECK:
 * ------------------------------------------------------------------------------
 * Double-check that this Place ID matches the exact SAME listing that is verified
 * and claimed in your Google Business Profile (GBP) dashboard — NOT a duplicate 
 * or unverified/unclaimed listing.
 * 
 * Using a Place ID from a duplicate or unclaimed listing is a very common reason 
 * why reviews don't show up on your official business profile!
 * ==============================================================================
 */

// Simple .env parser to avoid extra dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) env[key.trim()] = valueParts.join('=').trim();
    }
  });
  return env;
}

async function validatePlaceId() {
  const env = loadEnv();
  
  // Accept Place ID from CLI args or .env file
  const placeId = process.argv[2] || env.VITE_GOOGLE_PLACE_ID || env.GOOGLE_PLACE_ID;
  const apiKey = process.argv[3] || env.VITE_GOOGLE_MAPS_API_KEY || env.GOOGLE_MAPS_API_KEY;

  console.log('\n🔍 --- GOOGLE PLACE ID VALIDATOR ---');

  if (!placeId || placeId === 'YOUR_GOOGLE_PLACE_ID_HERE') {
    console.error('❌ Error: No valid Place ID provided.');
    console.log('Usage: node scripts/validatePlaceId.js <PLACE_ID> [API_KEY]');
    console.log('Or set VITE_GOOGLE_PLACE_ID in your .env file.\n');
    process.exit(1);
  }

  console.log(`📌 Checking Place ID: ${placeId}`);

  // 1. Basic Format Validation
  if (!placeId.startsWith('ChIJ') && !placeId.startsWith('GhIJ')) {
    console.warn('⚠️ Warning: Standard Google Place IDs usually start with "ChIJ..." or "GhIJ...". Please verify.');
  } else {
    console.log('✅ Format check passed: Starts with standard prefix.');
  }

  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;

  console.log(`🔗 Direct Write Review Link: ${reviewUrl}`);
  console.log(`🗺️ Google Maps Location Link: ${mapsUrl}`);

  // 2. Google Places API Fetch (if API key available)
  if (apiKey) {
    console.log('\n📡 Querying Google Places Details API...');
    try {
      const fields = 'name,formatted_address,rating,user_ratings_total,url,business_status';
      const endpoint = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const place = data.result;
        console.log('\n✅ Place ID successfully verified with Google Places API!');
        console.log('--------------------------------------------------');
        console.log(`🏢 Business Name: ${place.name}`);
        console.log(`📍 Address      : ${place.formatted_address}`);
        console.log(`⭐ Rating       : ${place.rating || 'N/A'} (${place.user_ratings_total || 0} reviews)`);
        console.log(`💼 Status       : ${place.business_status || 'OPERATIONAL'}`);
        console.log('--------------------------------------------------');
        console.log('\n⚠️ PLEASE VERIFY: Does the name and address above match your verified Google Business Profile dashboard?');
      } else {
        console.error(`❌ Google API returned error status: ${data.status}`);
        if (data.error_message) console.error(`Details: ${data.error_message}`);
      }
    } catch (err) {
      console.error('❌ Failed to fetch from Google Places API:', err.message);
    }
  } else {
    console.log('\nℹ️ No Google Maps API Key detected. Testing direct URL responsiveness...');
    try {
      const res = await fetch(reviewUrl, { method: 'HEAD', redirect: 'follow' });
      console.log(`📡 Direct Review Link HTTP Status: ${res.status} (${res.ok ? 'OK' : 'Error'})`);
    } catch (e) {
      console.log(`📡 Status check completed.`);
    }
    console.log('\n💡 Tip: Provide an API Key as the 2nd argument to fetch exact business name, address & rating automatically.');
  }

  console.log('\n==================================================');
  console.log('📌 CHECKLIST BEFORE ADDING TO .env:');
  console.log('1. Open the Direct Review Link above in a browser.');
  console.log('2. Ensure the pop-up opens for "Sree Jee Stay" in Varanasi.');
  console.log('3. Confirm this is your CLAIMED business profile, not an unverified duplicate.');
  console.log('==================================================\n');
}

validatePlaceId();
