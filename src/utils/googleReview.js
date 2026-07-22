/**
 * Google Business Review URL Generator Utility
 * Generates direct Google Review URL: https://search.google.com/local/writereview?placeid={GOOGLE_PLACE_ID}
 */

// Read Google Place ID from environment variables or fallback default
export const GOOGLE_PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4';

/**
 * Generate official Google Place ID review link
 * @param {string} placeId - Google Place ID or complete custom URL
 * @returns {string} - Direct Google Review write URL
 */
export function generateGoogleReviewUrl(placeId = GOOGLE_PLACE_ID) {
  const cleanId = (placeId || '').trim();
  
  if (!cleanId) {
    return `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
  }

  // If a full custom URL is passed (e.g. g.page/r/.../review or share.google/...), use it
  if (cleanId.startsWith('http://') || cleanId.startsWith('https://')) {
    return cleanId;
  }

  // Otherwise generate standard placeid writereview link
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(cleanId)}`;
}
