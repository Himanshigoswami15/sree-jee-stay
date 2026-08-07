import { z } from 'zod';

export const onboardHotelSchema = z.object({
  name: z.string().min(1, 'Hotel name is required'),
  hotelSlug: z.string().optional(),
  secretKey: z.string().optional(),
  logoUrl: z.string().optional(),
  themeColor: z.string().optional(),
  googlePlaceId: z.string().optional(),
  googleReviewUrl: z.string().optional(),
  tripadvisorReviewUrl: z.string().optional(),
  managerEmail: z.string().email('Invalid email format').or(z.literal('')).optional(),
  managerPhone: z.string().optional(),
  managerName: z.string().optional(),
  password: z.string().min(4, 'Manager password must be at least 4 characters').optional(),
  alertThreshold: z.number().int().min(1).max(5).optional(),
  tone: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export const auditLogSchema = z.object({
  hotelId: z.string().optional(),
  hotelSlug: z.string().optional(),
  eventType: z.string().min(1, 'Event type is required'),
  details: z.record(z.any()).optional().default({}),
});

export const checkDuplicateSchema = z.object({
  hotelSlug: z.string().optional(),
  hotelId: z.string().optional(),
  contact: z.string().min(1, 'Contact identifier is required'),
});

export const tagIdParamsSchema = z.object({
  tagId: z.string().min(1, 'Tag ID is required'),
});
