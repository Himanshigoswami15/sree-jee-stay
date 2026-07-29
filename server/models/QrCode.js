import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
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
  uniqueToken: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    default: 'Permanent Hotel QR Code',
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  scansCount: {
    type: Number,
    default: 0,
  },
  lastScannedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  collection: 'qr_codes',
});

qrCodeSchema.index({ hotelId: 1 });

export const QrCode = mongoose.model('QrCode', qrCodeSchema);
