import { GOOGLE_PLACE_ID } from '../utils/googleReview';

export const hotels = {
  'sree-jee-stay': {
    hotelId: 'sree-jee-stay',
    hotelSlug: 'sree-jee-stay',
    name: 'Sree Jee Stay - Homestay in Varanasi',
    hotelName: 'Sree Jee Stay - Homestay in Varanasi',
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
    hotelName: 'Sree Jee Stay - Homestay in Varanasi',
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
  'jj-elevates': {
    hotelId: 'jj-elevates',
    hotelSlug: 'jj-elevates',
    name: 'JJ Elevate',
    hotelName: 'JJ Elevate',
    themeColor: '#2563eb',
    googlePlaceId: 'https://www.google.com/maps/place/JJ+Elevate+%7C+Digital+Marketing+Agency+%7C+Branding+%7C+Advertising+%7C+Jodhpur/data=!4m2!3m1!1s0x39418c3539828e83:0x1b5a5db7f568a867?sa=X&ved=1t:2428&ictx=111',
    googleReviewUrl: 'https://www.google.com/maps/place/JJ+Elevate+%7C+Digital+Marketing+Agency+%7C+Branding+%7C+Advertising+%7C+Jodhpur/data=!4m2!3m1!1s0x39418c3539828e83:0x1b5a5db7f568a867?sa=X&ved=1t:2428&ictx=111',
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
    const conf = hotels[cleanId];
    return {
      ...conf,
      hotelName: conf.hotelName || conf.name || 'JJ elevates',
    };
  }

  // Format clean title from slug e.g. "jj-elevates" -> "JJ Elevates"
  const formattedTitle = cleanId === 'jj-elevates'
    ? 'JJ elevates'
    : cleanId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    ...hotels['sree-jee-stay'],
    hotelId: cleanId,
    hotelSlug: cleanId,
    name: formattedTitle,
    hotelName: formattedTitle,
  };
}

