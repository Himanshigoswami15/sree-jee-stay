/**
 * Google Business Review URL Generator Utility
 * Direct Google Review URL for JJ Review System.
 */

export const GOOGLE_SYDNEY_DEMO_ID = 'ChIJN1t_tDeuEmsRUsoyG83frY4';

export const GOOGLE_PLACE_ID = '';

/**
 * Extract Place ID from a string, Google URL, or query parameters if present
 */
export function extractPlaceId(inputStr = '') {
  if (!inputStr || typeof inputStr !== 'string') return '';
  const str = inputStr.trim();

  if (/^(ChIJ|GhIJ)[a-zA-Z0-9_-]+$/.test(str)) {
    return str;
  }

  const placeIdParam = str.match(/[?&]placeid=([a-zA-Z0-9_-]+)/i);
  if (placeIdParam && placeIdParam[1]) return placeIdParam[1];

  const placeIdColon = str.match(/place_id:([a-zA-Z0-9_-]+)/i);
  if (placeIdColon && placeIdColon[1]) return placeIdColon[1];

  const embeddedMatch = str.match(/(ChIJ[a-zA-Z0-9_-]+|GhIJ[a-zA-Z0-9_-]+)/);
  if (embeddedMatch && embeddedMatch[1]) return embeddedMatch[1];

  return '';
}

/**
 * Generate official Direct Google Review link (Write Review popup) or fallback custom URL
 */
export function generateGoogleReviewUrl(placeIdOrUrl = '', hotelName = '') {
  const input = (placeIdOrUrl || '').trim();

  if (input) {
    const extractedId = extractPlaceId(input);
    if (extractedId && extractedId !== GOOGLE_SYDNEY_DEMO_ID) {
      return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`;
    }

    if (input.startsWith('http://') || input.startsWith('https://')) {
      return input;
    }

    if (
      input && 
      input !== GOOGLE_SYDNEY_DEMO_ID && 
      input !== 'YOUR_GOOGLE_PLACE_ID_HERE'
    ) {
      return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(input)}`;
    }
  }

  const cleanName = (hotelName || '').trim();
  if (cleanName) {
    return `https://www.google.com/search?q=${encodeURIComponent(cleanName + ' review')}`;
  }

  return 'https://search.google.com/local/writereview';
}

/**
 * Determine URL or Place ID classification for UI feedback badges
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

/**
 * Validate Google Review Link input and return structured feedback
 */
export function validateGoogleReviewLink(inputStr = '') {
  if (!inputStr || !inputStr.trim()) {
    return {
      isValid: false,
      type: 'empty',
      message: 'No Google Review link or Place ID provided.',
    };
  }

  const str = inputStr.trim();
  const extractedId = extractPlaceId(str);

  if (extractedId) {
    return {
      isValid: true,
      type: 'direct_popup',
      placeId: extractedId,
      generatedUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`,
      message: `✨ Valid 1-Tap Write Review Popup Link! Extracted Place ID: ${extractedId}`,
    };
  }

  if (str.startsWith('http://') || str.startsWith('https://')) {
    return {
      isValid: true,
      type: 'custom_url',
      placeId: '',
      generatedUrl: str,
      message: '🌐 Valid custom Google web link provided. (To open the 5-star Write Review popup directly, enter Place ID starting with ChIJ...).',
    };
  }

  return {
    isValid: false,
    type: 'invalid',
    message: '⚠️ Invalid format. Please enter a valid URL (https://...) or a 27-character Place ID (ChIJ...).',
  };
}
