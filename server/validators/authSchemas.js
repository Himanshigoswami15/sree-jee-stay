import { z } from 'zod';

export const loginSchema = z.object({
  hotelId: z.string().min(1, 'Hotel identifier is required').optional(),
  hotelSlug: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(1, 'Password or PIN is required'),
});

export const changePasswordSchema = z.object({
  hotelId: z.string().optional(),
  hotelSlug: z.string().optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().min(4, 'New password must be at least 4 characters long'),
  isOtpReset: z.boolean().optional().default(false),
});
