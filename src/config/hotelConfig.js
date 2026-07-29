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
  return hotels[identifier] || hotels['sree-jee-stay'];
}
