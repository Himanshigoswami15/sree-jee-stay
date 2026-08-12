/**
 * Google Business Review URL Generator Utility
 * Direct Google Review URL for JJ Review System.
 */

export const GOOGLE_PLACE_ID = '';

/**
 * Extract Place ID from a string, Google URL, or query parameters if present
 */
export function extractPlaceId(inputStr = '') {
  if (!inputStr || typeof inputStr !== 'string') return '';
  const str = inputStr.trim();

  // Direct Place ID (e.g. ChIJN1t_tDeuEmsRUsoyG83frY4)
  if (/^(ChIJ|GhIJ)[a-zA-Z0-9_-]+$/.test(str)) {
    return str;
  }

  // URL parameter: ?placeid=ChIJ... or &placeid=ChIJ...
  const placeIdParam = str.match(/[?&]placeid=([a-zA-Z0-9_-]+)/i);
  if (placeIdParam && placeIdParam[1]) return placeIdParam[1];

  // URL fragment: place_id:ChIJ...
  const placeIdColon = str.match(/place_id:([a-zA-Z0-9_-]+)/i);
  if (placeIdColon && placeIdColon[1]) return placeIdColon[1];

  // Google Maps data parameter: !1sChIJ... (common in maps.google.com URLs)
  const mapsDataMatch = str.match(/!1s(ChIJ[a-zA-Z0-9_-]+|GhIJ[a-zA-Z0-9_-]+)/);
  if (mapsDataMatch && mapsDataMatch[1]) return mapsDataMatch[1];

  // Google Maps URL path: /place/ChIJ.../
  const placePathMatch = str.match(/\/place\/[^/]*\/(ChIJ[a-zA-Z0-9_-]+|GhIJ[a-zA-Z0-9_-]+)/);
  if (placePathMatch && placePathMatch[1]) return placePathMatch[1];

  // Google Maps ftid parameter: ftid=0x...:0x... (not a ChIJ but can be used)
  const ftidMatch = str.match(/ftid=(0x[a-fA-F0-9]+:0x[a-fA-F0-9]+)/);
  if (ftidMatch && ftidMatch[1]) return ftidMatch[1];

  // Any embedded ChIJ or GhIJ pattern anywhere in the string
  const embeddedMatch = str.match(/(ChIJ[a-zA-Z0-9_-]+|GhIJ[a-zA-Z0-9_-]+)/);
  if (embeddedMatch && embeddedMatch[1]) return embeddedMatch[1];

  return '';
}

/**
 * Extract a human-readable place name from a Google Maps URL path
 */
function extractPlaceNameFromUrl(url = '') {
  try {
    // Matches /place/Hotel+Name+Here/ or /place/Hotel%20Name/
    const match = url.match(/\/place\/([^/@?#]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
  } catch (e) {}
  return '';
}

/**
 * Generate official Direct Google Review link (Write Review popup) or fallback custom URL
 */
export function generateGoogleReviewUrl(placeIdOrUrl = '', hotelName = '') {
  const input = (placeIdOrUrl || '').trim();

  if (input) {
    const extractedId = extractPlaceId(input);
    if (extractedId) {
      return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(extractedId)}`;
    }

    // If it's a Google Maps URL but we couldn't extract a Place ID,
    // try to extract the business name from the URL and generate a search-based review link
    // instead of returning the raw Maps URL (which just opens the map location, not the review form)
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const nameFromUrl = extractPlaceNameFromUrl(input);
      if (nameFromUrl) {
        return `https://www.google.com/search?q=${encodeURIComponent(nameFromUrl + ' reviews')}`;
      }
      // For non-Google URLs or URLs we can't parse, return as-is
      if (!input.includes('google.com/maps')) {
        return input;
      }
      // Google Maps URL without extractable info — fall through to hotelName-based fallback
    }

    if (input && input !== 'YOUR_GOOGLE_PLACE_ID_HERE') {
      return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(input)}`;
    }
  }

  // Fallback: use hotel name to create a Google Search for reviews
  const cleanName = (hotelName || '').trim();
  if (cleanName) {
    return `https://www.google.com/search?q=${encodeURIComponent(cleanName + ' Google reviews')}`;
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
