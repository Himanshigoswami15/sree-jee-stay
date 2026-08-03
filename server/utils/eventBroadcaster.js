import { logger } from './logger.js';

// Active SSE client connections keyed by hotelSlug (Set of express response objects)
const clientsMap = new Map();

/**
 * Register an incoming SSE client connection
 */
export function addSseClient(hotelSlug = 'all', res) {
  const cleanSlug = String(hotelSlug).toLowerCase().trim();
  if (!clientsMap.has(cleanSlug)) {
    clientsMap.set(cleanSlug, new Set());
  }
  clientsMap.get(cleanSlug).add(res);
  logger.info(`📡 [SSE Connected] Client listening on channel "${cleanSlug}". Total active: ${clientsMap.get(cleanSlug).size}`);
}

/**
 * Remove an SSE client connection when disconnected
 */
export function removeSseClient(hotelSlug = 'all', res) {
  const cleanSlug = String(hotelSlug).toLowerCase().trim();
  if (clientsMap.has(cleanSlug)) {
    clientsMap.get(cleanSlug).delete(res);
    if (clientsMap.get(cleanSlug).size === 0) {
      clientsMap.delete(cleanSlug);
    }
  }
}

/**
 * Broadcast real-time SSE event to all connected devices for a hotel
 */
export function broadcastSystemEvent(hotelSlug = 'all', eventType, data = {}) {
  const cleanSlug = String(hotelSlug).toLowerCase().trim();
  const payload = JSON.stringify({
    type: eventType,
    hotelSlug: cleanSlug,
    timestamp: new Date().toISOString(),
    ...data,
  });
  const message = `data: ${payload}\n\n`;

  let sentCount = 0;

  // 1. Send to clients subscribed to specific hotel slug
  if (clientsMap.has(cleanSlug)) {
    for (const clientRes of clientsMap.get(cleanSlug)) {
      try {
        clientRes.write(message);
        sentCount++;
      } catch (err) {
        removeSseClient(cleanSlug, clientRes);
      }
    }
  }

  // 2. Send to clients subscribed to 'all' channel
  if (cleanSlug !== 'all' && clientsMap.has('all')) {
    for (const clientRes of clientsMap.get('all')) {
      try {
        clientRes.write(message);
        sentCount++;
      } catch (err) {
        removeSseClient('all', clientRes);
      }
    }
  }

  if (sentCount > 0) {
    logger.info(`⚡ [SSE Broadcast] Sent "${eventType}" for "${cleanSlug}" to ${sentCount} connected devices.`);
  }
}
