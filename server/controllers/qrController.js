import * as qrService from '../services/qrService.js';
import { DEFAULT_HOTEL_ID } from '../config/constants.js';

export async function generateQr(req, res, next) {
  try {
    const identifier = req.query.hotelSlug || req.body.hotelSlug || req.body.hotelId || req.hotelId || DEFAULT_HOTEL_ID;
    const qr = await qrService.getOrCreateQrToken(identifier);
    const host = req.headers.host || 'localhost:7890';
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
      return res.redirect('/sree-jee-stay');
    }

    const result = await qrService.logScanEvent(cleanToken, req);
    const targetSlug = (result && (result.hotelSlug || result.hotelId)) ? (result.hotelSlug || result.hotelId) : cleanToken;
    return res.redirect(`/${targetSlug}`);
  } catch (err) {
    const fallbackToken = req.params?.token ? String(req.params.token).toLowerCase() : 'sree-jee-stay';
    return res.redirect(`/${fallbackToken}`);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const identifier = req.query.hotelSlug || req.query.hotelId || req.hotelId || DEFAULT_HOTEL_ID;
    const analytics = await qrService.getScanAnalytics(identifier);
    return res.status(200).json({ success: true, analytics });
  } catch (err) {
    next(err);
  }
}

export async function downloadPng(req, res, next) {
  try {
    const identifier = req.query.hotelSlug || req.query.hotelId || req.hotelId || DEFAULT_HOTEL_ID;
    const qr = await qrService.getOrCreateQrToken(identifier);
    const host = req.headers.host || 'localhost:7890';
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
    const identifier = req.query.hotelSlug || req.query.hotelId || req.hotelId || DEFAULT_HOTEL_ID;
    const qr = await qrService.getOrCreateQrToken(identifier);
    const host = req.headers.host || 'localhost:7890';
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
