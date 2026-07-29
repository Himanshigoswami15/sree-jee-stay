import mongoose from 'mongoose';
import { FEEDBACK_STATUSES } from '../config/constants.js';

const feedbackSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  reviewText: {
    type: String,
    default: '',
  },
  guestContact: {
    type: String,
    default: '',
    trim: true,
  },
  guestContactNormalized: {
    type: String,
    default: '',
    trim: true,
  },
  postedPublic: {
    type: Boolean,
    default: false,
  },
  alertSent: {
    type: Boolean,
    default: false,
  },
  managerResolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: Object.values(FEEDBACK_STATUSES),
    default: FEEDBACK_STATUSES.SUBMITTED,
  },
}, {
  timestamps: true,
  collection: 'feedbacks',
});

feedbackSchema.index({ hotelId: 1, createdAt: -1 });
feedbackSchema.index({ hotelId: 1, rating: 1 });
feedbackSchema.index({ hotelId: 1, guestContactNormalized: 1 });
feedbackSchema.index({ hotelId: 1, status: 1 });
feedbackSchema.index({ hotelId: 1, alertSent: 1, managerResolved: 1 });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
