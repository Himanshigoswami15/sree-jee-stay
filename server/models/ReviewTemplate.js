import mongoose from 'mongoose';

const reviewTemplateSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  ratingLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  tone: {
    type: String,
    enum: ['professional', 'friendly', 'luxury', 'budget', 'family', 'business'],
    default: 'friendly',
  },
  openings: [{
    type: String,
    trim: true,
  }],
  closings: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
  collection: 'review_templates',
});

reviewTemplateSchema.index({ hotelId: 1, ratingLevel: 1 });

export const ReviewTemplate = mongoose.model('ReviewTemplate', reviewTemplateSchema);
