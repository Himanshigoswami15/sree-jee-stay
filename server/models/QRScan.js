import mongoose from 'mongoose';

const qrScanSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  hotelId: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  qrToken: {
    type: String,
    default: '',
    trim: true,
  },
  ip: {
    type: String,
    default: '127.0.0.1',
    trim: true,
  },
  device: {
    type: String,
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Mobile',
  },
  browser: {
    type: String,
    default: 'Chrome',
    trim: true,
  },
  redirectedTo: {
    type: String,
    enum: ['google', 'tripadvisor', 'facebook', 'internal', 'website'],
    default: 'internal',
  },
  rating: {
    type: Number,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'qr_scans',
});

qrScanSchema.index({ hotelId: 1, timestamp: -1 });

export const QRScan = mongoose.model('QRScan', qrScanSchema);
