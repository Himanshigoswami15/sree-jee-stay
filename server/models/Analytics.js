import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  date: {
    type: Date,
    required: true,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
  },
  nps: {
    type: Number,
    default: 0,
  },
  conversionRate: {
    type: Number,
    default: 0,
  },
  positiveTagCounts: {
    type: Map,
    of: Number,
    default: {},
  },
  negativeTagCounts: {
    type: Map,
    of: Number,
    default: {},
  },
  alertCount: {
    type: Number,
    default: 0,
  },
  resolvedCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  collection: 'analytics_snapshots',
});

analyticsSchema.index({ hotelId: 1, date: -1 });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
