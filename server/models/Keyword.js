import mongoose from 'mongoose';
import { KEYWORD_CATEGORIES } from '../config/constants.js';

const keywordSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ['positive', 'negative'],
    required: true,
  },
  tagId: {
    type: String,
    required: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  snippet: {
    type: String,
    default: '',
  },
  snippets: [{
    type: String,
  }],
  sortOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: 'keywords',
});

keywordSchema.index({ hotelId: 1, type: 1 });
keywordSchema.index({ hotelId: 1, tagId: 1 }, { unique: true });

export const Keyword = mongoose.model('Keyword', keywordSchema);
