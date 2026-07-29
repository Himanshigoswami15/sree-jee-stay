import { z } from 'zod';

export const submitFeedbackSchema = z.object({
  hotelId: z.string().optional(),
  hotelSlug: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  tags: z.array(z.string()).default([]),
  reviewText: z.string().default(''),
  guestContact: z.string().default(''),
  postedPublic: z.boolean().default(false),
});

export const resolveFeedbackSchema = z.object({
  notes: z.string().optional(),
});
