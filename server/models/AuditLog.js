import mongoose from 'mongoose';
import { AUDIT_LOG_TTL_DAYS } from '../config/constants.js';

const auditLogSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  eventType: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'audit_logs',
});

auditLogSchema.index({ hotelId: 1, timestamp: -1 });
auditLogSchema.index({ hotelId: 1, eventType: 1 });
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: AUDIT_LOG_TTL_DAYS * 24 * 60 * 60 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
