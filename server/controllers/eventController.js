import { addSseClient, removeSseClient } from '../utils/eventBroadcaster.js';

/**
 * Native Server-Sent Events (SSE) stream endpoint for real-time cross-device sync
 */
export function sseStream(req, res) {
  const hotelSlug = (req.query.hotelSlug || req.query.hotelId || 'all').toLowerCase().trim();

  // Set mandatory headers for Server-Sent Events HTTP streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform, max-age=0');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx/Vercel response buffering
  res.flushHeaders?.();

  // Send initial connection ACK
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', hotelSlug, timestamp: new Date().toISOString() })}\n\n`);

  addSseClient(hotelSlug, res);

  // Send heartbeat every 20 seconds to keep TCP/HTTP stream alive
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (err) {
      clearInterval(heartbeat);
      removeSseClient(hotelSlug, res);
    }
  }, 20000);

  // Handle client disconnection
  req.on('close', () => {
    clearInterval(heartbeat);
    removeSseClient(hotelSlug, res);
  });
}
