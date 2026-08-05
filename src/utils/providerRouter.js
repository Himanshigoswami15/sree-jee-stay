import { generateGoogleReviewUrl } from './googleReview.js';

export function getActiveProviders(tenantSettings) {
  if (!tenantSettings || !tenantSettings.providers) {
    return [
      {
        type: 'google',
        name: 'Google',
        url: tenantSettings?.googleReviewUrl || generateGoogleReviewUrl(tenantSettings?.googlePlaceId, tenantSettings?.hotelName || tenantSettings?.name),
        isEnabled: true
      }
    ];
  }

  return tenantSettings.providers
    .filter(provider => provider.isEnabled)
    .map(provider => {
      let url = '';
      let name = '';

      switch (provider.type) {
        case 'google':
          url = tenantSettings.googleReviewUrl || generateGoogleReviewUrl(tenantSettings.googlePlaceId, tenantSettings.hotelName || tenantSettings.name);
          name = 'Google';
          break;
        case 'tripadvisor':
          url = tenantSettings.tripadvisorReviewUrl || 'https://www.tripadvisor.com/UserReview';
          name = 'TripAdvisor';
          break;
        case 'booking':
          url = 'https://www.booking.com/';
          name = 'Booking.com';
          break;
        case 'facebook':
          url = 'https://www.facebook.com/';
          name = 'Facebook';
          break;
        case 'trustpilot':
          url = 'https://www.trustpilot.com/';
          name = 'Trustpilot';
          break;
        default:
          url = '#';
          name = 'Custom Provider';
      }

      return {
        ...provider,
        name,
        url
      };
    });
}
