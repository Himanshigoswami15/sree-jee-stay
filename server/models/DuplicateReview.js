import mongoose from 'mongoose';

const duplicateReviewSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  normalizedContact: {
    type: String,
    required: true,
    trim: true,
  },
  originalContact: {
    type: String,
    default: '',
    trim: true,
  },
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback',
    required: true,
  },
  blockedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'duplicate_reviews',
});

duplicateReviewSchema.index({ hotelId: 1, normalizedContact: 1 }, { unique: true });

export const DuplicateReview = mongoose.model('DuplicateReview', duplicateReviewSchema);
