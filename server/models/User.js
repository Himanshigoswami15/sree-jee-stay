import mongoose from 'mongoose';

const userRoles = ['owner', 'manager', 'reception'];

const userSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: userRoles,
    default: 'manager',
  },
  displayName: {
    type: String,
    default: 'Hotel Manager',
    trim: true,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
  failedAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  collection: 'users',
});

userSchema.index({ hotelId: 1, email: 1 }, { unique: true });

userSchema.methods.isLocked = function () {
  if (!this.lockedUntil) return false;
  return this.lockedUntil > new Date();
};

export const User = mongoose.model('User', userSchema);
