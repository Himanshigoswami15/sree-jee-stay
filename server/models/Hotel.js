import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  hotelSlug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logoUrl: {
    type: String,
    default: '',
    trim: true,
  },
  themeColor: {
    type: String,
    default: '#2563eb',
    trim: true,
  },
  googlePlaceId: {
    type: String,
    default: '',
    trim: true,
  },
  googleReviewUrl: {
    type: String,
    default: '',
    trim: true,
  },
  tripadvisorReviewUrl: {
    type: String,
    default: 'https://www.tripadvisor.com/UserReview',
    trim: true,
  },
  managerEmail: {
    type: String,
    default: '',
    trim: true,
    lowercase: true,
  },
  managerPhone: {
    type: String,
    default: '',
    trim: true,
  },
  alertThreshold: {
    type: Number,
    default: 3,
    min: 1,
    max: 5,
  },
  antiGatingNoticeEnabled: {
    type: Boolean,
    default: true,
  },
  preventDuplicateReviews: {
    type: Boolean,
    default: true,
  },
  tone: {
    type: String,
    enum: ['professional', 'friendly', 'luxury', 'budget', 'family', 'business'],
    default: 'friendly',
  },
  reviewLength: {
    type: String,
    enum: ['short', 'detailed'],
    default: 'short',
  },
  includeEmojis: {
    type: Boolean,
    default: true,
  },
  mentionStaff: {
    type: Boolean,
    default: true,
  },
  mentionCleanliness: {
    type: Boolean,
    default: true,
  },
  mentionFood: {
    type: Boolean,
    default: true,
  },
  mentionLocation: {
    type: Boolean,
    default: true,
  },
  customPrompt: {
    type: String,
    default: 'Write genuine, human-sounding reviews highlighting room cleanliness and warm staff hospitality.',
  },
  footerText: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'en',
  },
  providers: [{
    type: {
      type: String,
      enum: ['google', 'tripadvisor', 'booking', 'facebook', 'trustpilot'],
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
  collection: 'hotels',
  optimisticConcurrency: true,
});

hotelSchema.index({ name: 1 });
hotelSchema.index({ managerEmail: 1 });

export const Hotel = mongoose.model('Hotel', hotelSchema);
