import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sree_jee_stay';

const MONGOOSE_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

// Prevent Mongoose from buffering commands indefinitely when DB is disconnected
mongoose.set('bufferCommands', false);

let connectionPromise = null;

/**
 * Connect to MongoDB with state checks and retry logic
 */
export async function connectDB(retries = 3, delay = 1500) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const isVercel = process.env.VERCEL === '1';
  const isLocalUri = MONGODB_URI.includes('127.0.0.1') || MONGODB_URI.includes('localhost');

  // On Vercel, if MONGODB_URI is not set or points to localhost, skip connection attempt immediately
  if (isVercel && isLocalUri) {
    logger.warn('[Vercel] Local MONGODB_URI detected in Vercel serverless environment. Skipping MongoDB connection. To enable database persistence, configure MONGODB_URI with a MongoDB Atlas connection string in Vercel project settings.');
    return false;
  }

  if (mongoose.connection.readyState === 2) {
    let elapsed = 0;
    while (mongoose.connection.readyState === 2 && elapsed < 3000) {
      await new Promise((r) => setTimeout(r, 100));
      elapsed += 100;
    }
    if (mongoose.connection.readyState === 1) return true;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.info(`[MongoDB] Connection attempt ${attempt}/${retries}...`);
        await mongoose.connect(MONGODB_URI, MONGOOSE_OPTIONS);
        logger.info(`[MongoDB] Connected successfully to: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
        return true;
      } catch (err) {
        logger.error(`[MongoDB] Connection attempt ${attempt} failed: ${err.message}`);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5;
        } else {
          logger.error('[MongoDB] All connection attempts exhausted.');
          throw err;
        }
      }
    }
  })().finally(() => {
    connectionPromise = null;
  });

  return connectionPromise;
}

/**
 * Disconnect from MongoDB gracefully
 */
export async function disconnectDB() {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
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
mongoose.connection.on('error', (err) => {
  logger.error(`[MongoDB] Connection error: ${err.message}`);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  logger.warn('[MongoDB] Connection lost.');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  logger.info('[MongoDB] Reconnected.');
  isConnected = true;
});

export { mongoose };
