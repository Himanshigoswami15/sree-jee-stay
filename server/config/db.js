import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jj_review_system';

// Mongoose connection options optimized for MongoDB Atlas
const MONGOOSE_OPTIONS = {
  autoIndex: true,
  maxPoolSize: 20,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

let connectionPromise = null;
let lastFailedAt = 0;

/**
 * Connect to MongoDB (Atlas or local) with state checks and retry logic
 */
export async function connectDB(retries = 3, delay = 1000) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const isVercel = process.env.VERCEL === '1';
  const isLocalUri = MONGODB_URI.includes('127.0.0.1') || MONGODB_URI.includes('localhost');

  // On Vercel, if MONGODB_URI points to localhost, skip connection attempt immediately
  if (isVercel && isLocalUri) {
    logger.warn('[Vercel] Local MONGODB_URI detected in Vercel serverless environment. Skipping MongoDB connection. Configure MONGODB_URI in Vercel project settings for Atlas persistence.');
    return false;
  }

  // If local MongoDB connection failed recently (<15s ago), fast-fail to keep server responsive
  if (isLocalUri && (Date.now() - lastFailedAt < 15000)) {
    return false;
  }

  // If connection is in progress (readyState === 2 = connecting), wait for it
  if (mongoose.connection.readyState === 2) {
    let elapsed = 0;
    while (mongoose.connection.readyState === 2 && elapsed < 5000) {
      await new Promise((r) => setTimeout(r, 200));
      elapsed += 200;
    }
    if (mongoose.connection.readyState === 1) return true;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const maskedUri = MONGODB_URI.replace(/\/\/[^@]*@/, '//***:***@');
        logger.info(`[MongoDB] Connection attempt ${attempt}/${retries} → ${maskedUri}`);
        await mongoose.connect(MONGODB_URI, MONGOOSE_OPTIONS);
        logger.info(`[MongoDB] ✅ Connected successfully to: ${maskedUri}`);
        lastFailedAt = 0;
        return true;
      } catch (err) {
        logger.warn(`[MongoDB] ❌ Connection attempt ${attempt} failed: ${err.message}`);
        if (attempt < retries) {
          logger.info(`[MongoDB] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          logger.warn('[MongoDB] All connection attempts exhausted. Operating in high-performance in-memory fallback mode.');
          lastFailedAt = Date.now();
          return false;
        }
      }
    }
    return false;
  })().finally(() => {
    connectionPromise = null;
  });

  return connectionPromise;
}

/**
 * Disconnect from MongoDB gracefully
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState === 0) {
    logger.info('[MongoDB] Already disconnected.');
    return;
  }
  try {
    await mongoose.disconnect();
    logger.info('[MongoDB] Disconnected gracefully.');
  } catch (err) {
    logger.error(`[MongoDB] Disconnect error: ${err.message}`);
  }
}

// Graceful shutdown hooks
function handleShutdown(signal) {
  logger.info(`[MongoDB] Received ${signal}. Closing connection...`);
  disconnectDB().then(() => process.exit(0));
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Connection event listeners
mongoose.connection.on('connected', () => {
  logger.info('[MongoDB] Connection established.');
});

mongoose.connection.on('error', (err) => {
  logger.error(`[MongoDB] Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('[MongoDB] Connection lost.');
});

mongoose.connection.on('reconnected', () => {
  logger.info('[MongoDB] ✅ Reconnected successfully.');
});

export { mongoose };
