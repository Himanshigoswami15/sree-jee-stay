import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { QrCode, QRScan, Hotel, Settings, Feedback } from '../models/index.js';
import { getHotel } from './hotelService.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

/**
 * Helper to generate a 6-character random alphanumeric token
 */
function generateToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Generate or fetch unique QR Token for a hotel
 */
export async function getOrCreateQrToken(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  let qr = await QrCode.findOne({ hotelId, status: 'active' });
  if (!qr) {
    let token = generateToken();
    let existingToken = await QrCode.findOne({ uniqueToken: token });
    while (existingToken) {
      token = generateToken();
      existingToken = await QrCode.findOne({ uniqueToken: token });
    }

    qr = await QrCode.create({
      hotel: hotel ? hotel._id : null,
      hotelId,
      uniqueToken: token,
      title: 'Permanent Hotel QR Code',
      status: 'active',
    });
  }
  return qr;
}

/**
 * Parse User-Agent string to detect Device & Browser
 */
function parseUserAgent(uaStr = '') {
  const ua = uaStr.toLowerCase();
  let device = 'Desktop';
  if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
    device = /ipad|tablet/i.test(ua) ? 'Tablet' : 'Mobile';
  }

  let browser = 'Chrome';
  if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';

  return { device, browser };
}

/**
 * Record a QR Scan event and update scan counters
 */
export async function logScanEvent(tokenOrSlug, req) {
  const cleanStr = String(tokenOrSlug || '').trim();
  const lowerStr = cleanStr.toLowerCase();

  if (!cleanStr) {
    return { hotelId: DEFAULT_HOTEL_ID, hotelSlug: DEFAULT_HOTEL_ID, hotelName: 'Sree Jee Stay' };
  }

  // 1. Try matching hotel directly by slug or hotelId first
  let hotel = await getHotel(lowerStr);

  // 2. If not found by slug, search QrCode collection by uniqueToken
  let qr = null;
  if (!hotel || (hotel.hotelId === DEFAULT_HOTEL_ID && lowerStr !== DEFAULT_HOTEL_ID)) {
    qr = await QrCode.findOne({ uniqueToken: cleanStr.toUpperCase() });
    if (qr) {
      hotel = await getHotel(qr.hotelId);
    }
  }

  // 3. Determine target slug: prioritize matched hotel slug, or cleanStr if it contains hyphens/words, fallback to DEFAULT
  const targetSlug = (hotel && hotel.hotelSlug)
    ? hotel.hotelSlug
    : ((hotel && hotel.hotelId) ? hotel.hotelId : (lowerStr.includes('-') || lowerStr.length > 5 ? lowerStr : DEFAULT_HOTEL_ID));

  const finalHotelId = (hotel && hotel.hotelId) ? hotel.hotelId : targetSlug;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const ua = req.headers['user-agent'] || '';
  const { device, browser } = parseUserAgent(ua);

  // Log scan event asynchronously
  QRScan.create({
    hotel: hotel ? hotel._id : null,
    hotelId: finalHotelId,
    qrToken: qr ? qr.uniqueToken : cleanStr,
    ip: String(ip).split(',')[0].trim(),
    device,
    browser,
    redirectedTo: 'internal',
    timestamp: new Date(),
  }).catch(() => {});

  if (qr) {
    qr.scansCount += 1;
    qr.lastScannedAt = new Date();
    qr.save().catch(() => {});
  }

  logger.info(`📱 [QR Scan Logged] Resolved to slug "${targetSlug}" via input "${cleanStr}" (${device}/${browser}).`);

  return {
    hotelId: finalHotelId,
    hotelSlug: targetSlug,
    hotelName: (hotel && hotel.name) ? hotel.name : targetSlug,
    qrToken: qr ? qr.uniqueToken : cleanStr,
  };
}

/**
 * Fetch detailed QR Scan Analytics for a hotel
 */
export async function getScanAnalytics(identifier = DEFAULT_HOTEL_ID) {
  const hotel = await getHotel(identifier);
  const hotelId = hotel ? hotel.hotelId : identifier;

  const scans = await QRScan.find({ hotelId }).sort({ timestamp: -1 });
  const totalScans = scans.length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayScans = scans.filter((s) => new Date(s.timestamp) >= startOfToday).length;

  const googleRedirects = scans.filter((s) => s.redirectedTo === 'google').length;
  const tripadvisorRedirects = scans.filter((s) => s.redirectedTo === 'tripadvisor').length;
  const facebookRedirects = scans.filter((s) => s.redirectedTo === 'facebook').length;
  const internalFeedback = scans.filter((s) => s.redirectedTo === 'internal').length;

  const feedbacks = await Feedback.find({ hotelId });
  const postedPublicCount = feedbacks.filter((f) => f.postedPublic).length;
  const conversionRate = totalScans > 0 ? Math.round((postedPublicCount / totalScans) * 100) : 0;

  // Calculate top scan hour
  const hourCounts = {};
  scans.forEach((s) => {
    const hour = new Date(s.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  let topHour = 19; // Default 7 PM
  let maxCount = 0;
  Object.keys(hourCounts).forEach((h) => {
    if (hourCounts[h] > maxCount) {
      maxCount = hourCounts[h];
      topHour = parseInt(h, 10);
    }
  });

  const formattedTopHour = topHour === 0 ? '12 AM' : topHour < 12 ? `${topHour} AM` : topHour === 12 ? '12 PM' : `${topHour - 12} PM`;

  return {
    hotelId,
    totalScans,
    todayScans,
    googleRedirects,
    tripadvisorRedirects,
    facebookRedirects,
    internalFeedback,
    conversionRate,
    topScanTime: formattedTopHour,
  };
}

/**
 * Generate high-res PNG Data URL for a QR Code
 */
export async function generateQrPngDataUrl(targetUrl) {
  return await QRCode.toDataURL(targetUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 400,
    color: {
      dark: '#1e293b',
      light: '#ffffff',
    },
  });
}

/**
 * Generate SVG string for a QR Code
 */
export async function generateQrSvgString(targetUrl) {
  return await QRCode.toString(targetUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#1e293b',
      light: '#ffffff',
    },
  });
}

/**
 * Export printable PDF Table Tent Card / Standee using pdf-lib
 */
export async function exportPdfTentCard(identifier = DEFAULT_HOTEL_ID, targetUrl) {
  const hotel = await getHotel(identifier);
  const hotelName = hotel ? hotel.name : 'Sree Jee Stay';

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 600]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background card frame
  page.drawRectangle({
    x: 20,
    y: 20,
    width: 360,
    height: 560,
    borderColor: rgb(0.15, 0.39, 0.92),
    borderWidth: 3,
    color: rgb(0.98, 0.99, 1.0),
  });

  // Top header text
  page.drawText('LOVE YOUR EXPERIENCE?', {
    x: 105,
    y: 535,
    size: 15,
    font: fontBold,
    color: rgb(0.15, 0.39, 0.92),
  });

  page.drawText(hotelName, {
    x: 40,
    y: 505,
    size: 16,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.16),
  });

  page.drawText('Scan to leave a Google Review', {
    x: 110,
    y: 475,
    size: 12,
    font: fontBold,
    color: rgb(0.05, 0.59, 0.41),
  });

  // Embed PNG QR Code image
  const pngDataUrl = await generateQrPngDataUrl(targetUrl);
  const pngBase64 = pngDataUrl.split(',')[1];
  const pngImageBytes = Buffer.from(pngBase64, 'base64');
  const qrImage = await pdfDoc.embedPng(pngImageBytes);

  page.drawImage(qrImage, {
    x: 75,
    y: 200,
    width: 250,
    height: 250,
  });

  // Footer instructions
  page.drawText('1. Scan QR   -->   2. Tap Highlights   -->   3. Post to Google', {
    x: 45,
    y: 150,
    size: 10,
    font: fontBold,
    color: rgb(0.2, 0.25, 0.35),
  });

  page.drawText('Thank you for supporting our local business!', {
    x: 75,
    y: 115,
    size: 11,
    font: fontBold,
    color: rgb(0.15, 0.39, 0.92),
  });

  page.drawText('Powered by JJ Review System', {
    x: 130,
    y: 50,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
