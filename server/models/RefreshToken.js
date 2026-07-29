import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  tokenHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  family: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'refresh_tokens',
});

refreshTokenSchema.index({ tokenHash: 1 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ family: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateTokenFamily() {
  return crypto.randomBytes(32).toString('hex');
}

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
