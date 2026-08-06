import { generateGoogleReviewUrl } from './googleReview.js';

export function getActiveProviders(hotelSettings) {
  if (!hotelSettings || !hotelSettings.providers) {
    return [
      {
        type: 'google',
        name: 'Google',
        url: hotelSettings?.googleReviewUrl || generateGoogleReviewUrl(hotelSettings?.googlePlaceId, hotelSettings?.hotelName || hotelSettings?.name),
        isEnabled: true
      }
    ];
  }

  return hotelSettings.providers
    .filter(provider => provider.isEnabled)
    .map(provider => {
      let url = '';
      let name = '';

      switch (provider.type) {
        case 'google':
          url = hotelSettings.googleReviewUrl || generateGoogleReviewUrl(hotelSettings.googlePlaceId, hotelSettings.hotelName || hotelSettings.name);
          name = 'Google';
          break;
        case 'tripadvisor':
          url = hotelSettings.tripadvisorReviewUrl || 'https://www.tripadvisor.com/UserReview';
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
