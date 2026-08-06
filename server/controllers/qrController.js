import * as qrService from '../services/qrService.js';
import { getHotel } from '../services/hotelService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function generateQr(req, res, next) {
  try {
    const identifier = req.hotelId || req.body?.hotelSlug || req.query?.hotelSlug;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const hotel = await getHotel(identifier);
    if (!hotel) {
      throw new AppError(`Hotel "${identifier}" not found.`, 404);
    }

    const qr = await qrService.getOrCreateQrToken(identifier);
    const configuredClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/+$/, '') : null;
    const forwardHost = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:8080';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = configuredClientUrl || `${protocol}://${forwardHost}`;
    const targetUrl = `${baseUrl}/r/${hotel.hotelSlug}`;

    const pngUrl = await qrService.generateQrPngDataUrl(targetUrl);
    const svgString = await qrService.generateQrSvgString(targetUrl);

    return res.status(200).json({
      success: true,
      qrToken: qr.uniqueToken,
      hotelSlug: hotel.hotelSlug,
      targetUrl,
      pngUrl,
      svgString,
      scansCount: qr.scansCount,
    });
  } catch (err) {
    next(err);
  }
}

export async function resolveScan(req, res, next) {
  try {
    const rawToken = req.params.token || req.params.hotelSlug || req.params[0] || req.query.hotelSlug || '';
    const cleanToken = String(rawToken).toLowerCase().trim();

    if (!cleanToken) {
      return res.status(404).json({ success: false, error: 'Hotel slug or QR token parameter is required.' });
    }

    const result = await qrService.logScanEvent(cleanToken, req);
    if (!result || (!result.hotelSlug && !result.hotelId)) {
      return res.status(404).json({
        success: false,
        error: `Hotel profile for "${cleanToken}" not found in MongoDB Atlas.`,
      });
    }

    const targetSlug = result.hotelSlug || result.hotelId;
    return res.redirect(`/${targetSlug}`);
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const identifier = req.hotelId || req.query?.hotelSlug;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const analytics = await qrService.getScanAnalytics(identifier);
    return res.status(200).json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
}

export async function downloadPng(req, res, next) {
  try {
    const identifier = req.hotelId || req.query?.hotelSlug;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const hotel = await getHotel(identifier);
    if (!hotel) {
      throw new AppError(`Hotel "${identifier}" not found.`, 404);
    }

    const configuredClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/+$/, '') : null;
    const forwardHost = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:8080';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = configuredClientUrl || `${protocol}://${forwardHost}`;
    const targetUrl = `${baseUrl}/r/${hotel.hotelSlug}`;

    const pngUrl = await qrService.generateQrPngDataUrl(targetUrl);
    const base64Data = pngUrl.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${hotel.hotelSlug}-qr-code.png"`);
    return res.send(imgBuffer);
  } catch (err) {
    next(err);
  }
}

export async function downloadPdf(req, res, next) {
  try {
    const identifier = req.hotelId || req.query?.hotelSlug;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const hotel = await getHotel(identifier);
    if (!hotel) {
      throw new AppError(`Hotel "${identifier}" not found.`, 404);
    }

    const configuredClientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/+$/, '') : null;
    const forwardHost = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:8080';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = configuredClientUrl || `${protocol}://${forwardHost}`;
    const targetUrl = `${baseUrl}/r/${hotel.hotelSlug}`;

    const pdfBuffer = await qrService.exportPdfTentCard(hotel.hotelSlug, targetUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${hotel.hotelSlug}-tent-card.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
