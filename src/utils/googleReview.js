/**
 * Google Business Review URL Generator Utility
 * Direct Google Review URL for Sree Jee Stay (Varanasi).
 */

export const GOOGLE_SYDNEY_DEMO_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
export const SREE_JEE_STAY_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Sree+Jee+Stay+Digiya+Jaitpura+Varanasi';

export const GOOGLE_PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID || '';

/**
 * Extract Place ID from a string or Google URL if present
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

  // 2. Extract from URL query parameter ?placeid=...
  const placeIdParam = str.match(/[?&]placeid=([a-zA-Z0-9_-]+)/i);
  if (placeIdParam && placeIdParam[1]) return placeIdParam[1];

  // 3. Extract from place_id:ChIJ... in search URL
  const placeIdColon = str.match(/place_id:([a-zA-Z0-9_-]+)/i);
  if (placeIdColon && placeIdColon[1]) return placeIdColon[1];

  return '';
}

/**
 * Generate official Direct Google Review link (Write Review popup) for Sree Jee Stay
 * @param {string} placeIdOrUrl - Google Place ID or complete custom URL
 * @returns {string} - Direct Google Write Review URL (opens review bar directly)
 */
export function generateGoogleReviewUrl(placeIdOrUrl = GOOGLE_PLACE_ID) {
  const cleanInput = (placeIdOrUrl || '').trim();

  // 1. Extract embedded Place ID from string or URL
  const extractedId = extractPlaceId(cleanInput);
  if (extractedId && extractedId !== GOOGLE_SYDNEY_DEMO_ID) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`;
  }

  // 2. If a full HTTP/HTTPS URL is passed
  if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
    return cleanInput;
  }

  // 3. If a valid custom Place ID string is provided
  if (
    cleanInput && 
    cleanInput !== GOOGLE_SYDNEY_DEMO_ID && 
    cleanInput !== 'YOUR_GOOGLE_PLACE_ID_HERE'
  ) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(cleanInput)}`;
  }

  // 4. Default fallback when no Place ID is configured
  return SREE_JEE_STAY_MAPS_URL;
}

