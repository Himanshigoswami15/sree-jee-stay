/**
 * Google Business Review URL Generator Utility
 * Direct Google Review URL for Sree Jee Stay (Varanasi).
 */

export const GOOGLE_SYDNEY_DEMO_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
export const SREE_JEE_STAY_MAPS_URL = 'https://g.page/r/CTERYeDefsTREAE/review';

export const GOOGLE_PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID || '';

/**
 * Extract Place ID from a string, Google URL, or query parameters if present
 * @param {string} inputStr 
 * @returns {string}
 */
export function extractPlaceId(inputStr = '') {
  if (!inputStr || typeof inputStr !== 'string') return '';
  const str = inputStr.trim();

  // 1. Standard Google Place ID format (starts with ChIJ or GhIJ)
  if (/^(ChIJ|GhIJ)[a-zA-Z0-9_-]+$/.test(str)) {
    return str;
  }

  // 2. Extract from URL query parameter ?placeid=... or &placeid=...
  const placeIdParam = str.match(/[?&]placeid=([a-zA-Z0-9_-]+)/i);
  if (placeIdParam && placeIdParam[1]) return placeIdParam[1];

  // 3. Extract from place_id:ChIJ... in Google Maps search URL
  const placeIdColon = str.match(/place_id:([a-zA-Z0-9_-]+)/i);
  if (placeIdColon && placeIdColon[1]) return placeIdColon[1];

  // 4. Any embedded ChIJ / GhIJ token in a long URL
  const embeddedMatch = str.match(/(ChIJ[a-zA-Z0-9_-]+|GhIJ[a-zA-Z0-9_-]+)/);
  if (embeddedMatch && embeddedMatch[1]) return embeddedMatch[1];

  return '';
}

/**
 * Generate official Direct Google Review link (Write Review popup) or fallback custom URL
 * @param {string} placeIdOrUrl - Google Place ID or complete custom URL
 * @returns {string} - Direct Google Write Review URL or custom URL
 */
export function generateGoogleReviewUrl(placeIdOrUrl = '') {
  const input = (placeIdOrUrl || GOOGLE_PLACE_ID || '').trim();

  if (!input) return SREE_JEE_STAY_MAPS_URL;

  // 1. Extract embedded Place ID from string or URL
  const extractedId = extractPlaceId(input);
  if (extractedId && extractedId !== GOOGLE_SYDNEY_DEMO_ID) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`;
  }

  // 2. If a full HTTP/HTTPS URL is passed
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }

  // 3. If a valid custom Place ID string is provided
  if (
    input && 
    input !== GOOGLE_SYDNEY_DEMO_ID && 
    input !== 'YOUR_GOOGLE_PLACE_ID_HERE'
  ) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(input)}`;
  }

  // 4. Default fallback when no Place ID is configured
  return SREE_JEE_STAY_MAPS_URL;
}

/**
 * Determine URL or Place ID classification for UI feedback badges
 * @param {string} inputStr 
 * @returns {'direct_popup' | 'custom_url' | 'place_id' | 'none' | 'invalid'}
 */
export function getUrlType(inputStr = '') {
  if (!inputStr || typeof inputStr !== 'string') return 'none';
  const str = inputStr.trim();
  if (!str) return 'none';

  const extracted = extractPlaceId(str);
  if (extracted) return 'direct_popup';
  if (str.startsWith('http://') || str.startsWith('https://')) return 'custom_url';
  if (/^[a-zA-Z0-9_-]{5,}$/.test(str)) return 'place_id';
  return 'invalid';
}


