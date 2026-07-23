/**
 * Google Business Review URL Generator Utility
 * Direct Google Review URL for Sree Jee Stay (Varanasi).
 */

export const GOOGLE_SYDNEY_DEMO_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
export const SREE_JEE_STAY_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Sree+Jee+Stay+Digiya+Jaitpura+Varanasi';

export const GOOGLE_PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID || '';

/**
 * Generate official Google Review link for Sree Jee Stay
 * @param {string} placeId - Google Place ID or complete custom URL
 * @returns {string} - Direct Google Review / Location URL for Sree Jee Stay
 */
export function generateGoogleReviewUrl(placeId = GOOGLE_PLACE_ID) {
  const cleanId = (placeId || '').trim();

  // 1. If a full URL is passed (e.g. g.page/r/... or share link), use it directly
  if (cleanId.startsWith('http://') || cleanId.startsWith('https://')) {
    return cleanId;
  }

  // 2. If a valid custom Place ID is provided (and NOT the old Google Sydney demo ID)
  if (
    cleanId && 
    cleanId !== GOOGLE_SYDNEY_DEMO_ID && 
    cleanId !== 'YOUR_GOOGLE_PLACE_ID_HERE'
  ) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(cleanId)}`;
  }

  // 3. Direct Google Maps profile link for Sree Jee Stay (Varanasi)
  return SREE_JEE_STAY_MAPS_URL;
}
