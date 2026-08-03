export function getHotelConfig(identifier) {
  if (!identifier) return null;
  const cleanId = String(identifier).toLowerCase().trim();

  const formattedTitle = cleanId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    hotelId: cleanId,
    hotelSlug: cleanId,
    name: formattedTitle,
    hotelName: formattedTitle,
    themeColor: '#2563eb',
    googlePlaceId: '',
    googleReviewUrl: '',
    tripadvisorReviewUrl: 'https://www.tripadvisor.com/UserReview',
    managerEmail: '',
    managerPhone: '',
    alertThreshold: 3,
    antiGatingNoticeEnabled: true,
    preventDuplicateReviews: true,
    tone: 'friendly',
    providers: [
      { type: 'google', isEnabled: true },
      { type: 'tripadvisor', isEnabled: true },
    ],
  };
}
