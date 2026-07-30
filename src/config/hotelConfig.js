import { GOOGLE_PLACE_ID } from '../utils/googleReview';

export const hotels = {
  'sree-jee-stay': {
    hotelId: 'sree-jee-stay',
    hotelSlug: 'sree-jee-stay',
    name: 'Sree Jee Stay - Homestay in Varanasi',
    themeColor: '#2563eb',
    googlePlaceId: GOOGLE_PLACE_ID,
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: 'himanshigoswami9057@gmail.com',
    managerPhone: '+91 98765 43210',
    alertThreshold: 3,
    antiGatingNoticeEnabled: true,
    preventDuplicateReviews: true,
    tone: 'friendly',
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true },
    ],
  },
  'demo': {
    hotelId: 'demo',
    hotelSlug: 'demo',
    name: 'Sree Jee Stay - Homestay in Varanasi',
    themeColor: '#2563eb',
    googlePlaceId: GOOGLE_PLACE_ID,
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: 'himanshigoswami9057@gmail.com',
    managerPhone: '+91 98765 43210',
    alertThreshold: 3,
    antiGatingNoticeEnabled: true,
    preventDuplicateReviews: true,
    tone: 'friendly',
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true },
    ],
  },
};

export function getHotelConfig(identifier = 'sree-jee-stay') {
  const cleanId = (identifier || 'sree-jee-stay').toLowerCase().trim();

  if (hotels[cleanId]) {
    return hotels[cleanId];
  }

  // Check localStorage for registered hotels
  try {
    const saved = localStorage.getItem('jj_registered_hotels');
    if (saved) {
      const parsed = JSON.parse(saved);
      const found = parsed.find((h) => h.hotelSlug === cleanId || h.hotelId === cleanId);
      if (found) {
        return {
          ...hotels['sree-jee-stay'],
          hotelId: cleanId,
          hotelSlug: cleanId,
          name: found.name,
          hotelName: found.name,
        };
      }
    }
  } catch (e) {}

  // Format clean title from slug e.g. "jj-elevates" -> "JJ Elevates"
  const formattedTitle = cleanId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    ...hotels['sree-jee-stay'],
    hotelId: cleanId,
    hotelSlug: cleanId,
    name: formattedTitle,
    hotelName: formattedTitle,
  };
}
