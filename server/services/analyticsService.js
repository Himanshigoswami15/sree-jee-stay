import { Feedback, Settings } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { RATING_KEYWORDS } from '../../src/utils/reviewGenerator.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function getDashboardMetrics(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const settings = await Settings.findOne({ hotelId });
  const alertThreshold = settings?.alertThreshold || 3;

  const feedbacks = await Feedback.find({ hotelId }).sort({ createdAt: -1 });
  const totalReviews = feedbacks.length;

  const now = Date.now();
  const oneWeekAgo = new Date(now - 7 * 24 * 3600 * 1000);
  const oneMonthAgo = new Date(now - 30 * 24 * 3600 * 1000);

  const reviewsThisWeek = feedbacks.filter((f) => new Date(f.createdAt) >= oneWeekAgo).length;
  const reviewsThisMonth = feedbacks.filter((f) => new Date(f.createdAt) >= oneMonthAgo).length;

  const avgRating = totalReviews > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const unresolvedAlerts = feedbacks.filter(
    (f) => f.rating <= alertThreshold && !f.managerResolved
  ).length;

  const promoters = feedbacks.filter((f) => f.rating >= 4).length;
  const detractors = feedbacks.filter((f) => f.rating <= 3).length;
  const nps = totalReviews > 0
    ? Math.round(((promoters - detractors) / totalReviews) * 100)
    : 100;

  const postedPublicCount = feedbacks.filter((f) => f.postedPublic).length;
  const conversionRate = totalReviews > 0
    ? Math.round((postedPublicCount / totalReviews) * 100)
    : 0;

  const tagCounts = {};
  feedbacks.forEach((fb) => {
    if (fb.tags && Array.isArray(fb.tags)) {
      fb.tags.forEach((tagId) => {
        tagCounts[tagId] = (tagCounts[tagId] || 0) + 1;
      });
    }
  });

  const totalSubmissions = totalReviews || 1;

  const positiveStats = RATING_KEYWORDS.positive.map((item) => {
    const count = tagCounts[item.id] || 0;
    const percentage = Math.round((count / totalSubmissions) * 100);
    return { ...item, count, percentage };
  }).sort((a, b) => b.count - a.count);

  const negativeStats = RATING_KEYWORDS.negative.map((item) => {
    const count = tagCounts[item.id] || 0;
    const percentage = Math.round((count / totalSubmissions) * 100);
    return { ...item, count, percentage };
  }).sort((a, b) => b.count - a.count);

  const topHighlight = positiveStats[0] && positiveStats[0].count > 0
    ? positiveStats[0].label
    : 'Spotless Room';

  const topComplaint = negativeStats[0] && negativeStats[0].count > 0
    ? negativeStats[0].label
    : 'None Reported';

  return {
    hotelId,
    hotelName: settings?.hotelName || hotel?.name || 'Sree Jee Stay',
    totalReviews,
    reviewsThisWeek,
    reviewsThisMonth,
    avgRating: parseFloat(avgRating),
    unresolvedAlerts,
    nps,
    conversionRate,
    topHighlight,
    topComplaint,
    alertThreshold,
    positiveStats,
    negativeStats,
  };
}
