import { GOOGLE_PLACE_ID } from '../utils/googleReview';

export const tenants = {
  'demo': {
    id: 'demo',
    name: 'Sree Jee Stay - Homestay in Varanasi',
    googlePlaceId: GOOGLE_PLACE_ID,
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: 'himanshigoswami9057@gmail.com',
    managerPhone: '+91 98765 43210',
    alertThreshold: 3,
    antiGatingNoticeEnabled: true,
    managerPin: '1234',
    preventDuplicateReviews: true,
    locations: [
      { id: 'main', name: 'Main Location' }
    ],
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: false }
    ]
  },
  'sree-jee-stay': {
    id: 'sree-jee-stay',
    name: 'Sree Jee Stay - Homestay in Varanasi',
    googlePlaceId: GOOGLE_PLACE_ID,
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: 'himanshigoswami9057@gmail.com',
    managerPhone: '+91 98765 43210',
    alertThreshold: 3,
    antiGatingNoticeEnabled: true,
    managerPin: '1234',
    preventDuplicateReviews: true,
    locations: [
      { id: 'main', name: 'Main Location' }
    ],
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true }
    ]
  }
};

export function getTenantConfig(tenantId) {
  return tenants[tenantId] || tenants['demo'];
}
