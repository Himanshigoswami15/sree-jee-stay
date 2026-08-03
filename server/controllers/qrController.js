import * as qrService from '../services/qrService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function generateQr(req, res, next) {
  try {
    const identifier = req.hotelId;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const qr = await qrService.getOrCreateQrToken(identifier);
    const host = req.headers.host || 'localhost:8080';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const targetUrl = `${protocol}://${host}/r/${qr.uniqueToken}`;

    const pngUrl = await qrService.generateQrPngDataUrl(targetUrl);
    const svgString = await qrService.generateQrSvgString(targetUrl);

    return res.status(200).json({
      success: true,
      qrToken: qr.uniqueToken,
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
    const rawToken = req.params.token || req.params[0] || req.query.hotelSlug || '';
    const cleanToken = String(rawToken).toLowerCase().trim();

    if (!cleanToken) {
      return res.status(404).json({ success: false, error: 'QR Code token or hotel slug parameter required.' });
    }

    const result = await qrService.logScanEvent(cleanToken, req);
    if (!result || (!result.hotelSlug && !result.hotelId)) {
      return res.redirect(`/${cleanToken}`);
    }

    const targetSlug = result.hotelSlug || result.hotelId;
    return res.redirect(`/${targetSlug}`);
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const identifier = req.hotelId;
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
    const identifier = req.hotelId;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const qr = await qrService.getOrCreateQrToken(identifier);
    const host = req.headers.host || 'localhost:8080';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const targetUrl = `${protocol}://${host}/r/${qr.uniqueToken}`;

    const pngUrl = await qrService.generateQrPngDataUrl(targetUrl);
    const base64Data = pngUrl.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${identifier}-qr-code.png"`);
    return res.send(imgBuffer);
  } catch (err) {
    next(err);
  }
}

export async function downloadPdf(req, res, next) {
  try {
    const identifier = req.hotelId;
    if (!identifier) {
      throw new AppError('Hotel identifier is required.', 400);
    }

    const qr = await qrService.getOrCreateQrToken(identifier);
    const host = req.headers.host || 'localhost:8080';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const targetUrl = `${protocol}://${host}/r/${qr.uniqueToken}`;

    const pdfBuffer = await qrService.exportPdfTentCard(identifier, targetUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${identifier}-tent-card.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
