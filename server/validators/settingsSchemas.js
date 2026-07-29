import { z } from 'zod';
import { KEYWORD_CATEGORIES, WRITING_TONES } from '../config/constants.js';

export const updateSettingsSchema = z.object({
  hotelName: z.string().min(1, 'Hotel name is required').optional(),
  logoUrl: z.string().optional(),
  themeColor: z.string().optional(),
  googlePlaceId: z.string().optional(),
  googleReviewUrl: z.string().optional(),
  tripadvisorReviewUrl: z.string().optional(),
  managerEmail: z.string().email('Invalid manager email').or(z.literal('')).optional(),
  managerPhone: z.string().optional(),
  alertThreshold: z.number().int().min(1).max(5).optional(),
  preventDuplicateReviews: z.boolean().optional(),
  tone: z.enum(WRITING_TONES).optional(),
  reviewLength: z.enum(['short', 'detailed']).optional(),
  includeEmojis: z.boolean().optional(),
  mentionStaff: z.boolean().optional(),
  mentionCleanliness: z.boolean().optional(),
  mentionFood: z.boolean().optional(),
  mentionLocation: z.boolean().optional(),
  customPrompt: z.string().optional(),
  footerText: z.string().optional(),
  language: z.string().optional(),
  providers: z.array(z.object({
    type: z.enum(['google', 'tripadvisor', 'booking', 'facebook', 'trustpilot']),
    isEnabled: z.boolean(),
  })).optional(),
});

export const addKeywordSchema = z.object({
  type: z.enum(['positive', 'negative']),
  label: z.string().min(1, 'Label is required'),
  category: z.enum(KEYWORD_CATEGORIES).default('General'),
  snippet: z.string().optional(),
  snippets: z.array(z.string()).optional(),
});
