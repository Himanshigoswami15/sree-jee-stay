import QRCode from 'qrcode';

/**
 * Generate a QR code data URL for a given target URL or room ID
 */
export async function generateQrDataUrl(text, options = {}) {
  try {
    const opts = {
      width: options.width || 250,
      margin: options.margin || 2,
      color: {
        dark: options.darkColor || '#1e293b',
        light: options.lightColor || '#ffffff',
      },
      ...options,
    };
    const dataUrl = await QRCode.toDataURL(text, opts);
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return null;
  }
}
