import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const ATLAS_FALLBACK_URI = 'mongodb+srv://jjreview:JJelevate@cluster0.xiitj9c.mongodb.net/jj_review_system?retryWrites=true&w=majority&appName=Cluster0';

function getEffectiveMongoUri() {
  const envUri = process.env.MONGODB_URI || '';
  if (!envUri || envUri.includes('127.0.0.1') || envUri.includes('localhost') || /<username>|<password>|<cluster>/i.test(envUri)) {
    return ATLAS_FALLBACK_URI;
  }
  return envUri;
}

const MONGODB_URI = getEffectiveMongoUri();

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
let lastConnectionError = null;

/**
 * Ensure active database connection before executing service queries
 * Handles all Mongoose connection states:
 * 0 = disconnected -> trigger connectDB()
 * 1 = connected -> return true immediately
 * 2 = connecting -> wait for in-flight connection promise
 * 3 = disconnecting -> wait and reconnect
 */
export async function ensureDbConnected() {
  switch (mongoose.connection.readyState) {
    case 1:
      return true;
    case 2:
      if (connectionPromise) {
        return await connectionPromise;
      }
      let elapsed = 0;
      while (mongoose.connection.readyState === 2 && elapsed < 5000) {
        await new Promise((r) => setTimeout(r, 200));
        elapsed += 200;
      }
      return mongoose.connection.readyState === 1;
    default:
      return await connectDB(3, 1000);
  }
}

/**
 * Connect to MongoDB (Atlas or local) with state checks and retry logic
 */
export async function connectDB(retries = 3, delay = 1000) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const isVercel = process.env.VERCEL === '1';
  const isLocalUri = MONGODB_URI.includes('127.0.0.1') || MONGODB_URI.includes('localhost');
  const hasPlaceholders = MONGODB_URI.includes('<USERNAME>') || MONGODB_URI.includes('<PASSWORD>') || MONGODB_URI.includes('<CLUSTER>');

  if (hasPlaceholders) {
    logger.error('[MongoDB] ❌ MONGODB_URI in environment contains unreplaced placeholders (<USERNAME>/<PASSWORD>/<CLUSTER>). Real MongoDB database connection CANNOT be established until valid credentials are provided.');
    return false;
  }

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
        logger.info(`[MongoDB] ✅ Connected successfully to: ${maskedUri} | Host: ${mongoose.connection.host || 'Atlas'} | Database: ${mongoose.connection.name}`);
        lastFailedAt = 0;
        lastConnectionError = null;
        return true;
      } catch (err) {
        lastConnectionError = err.message;
        logger.warn(`[MongoDB] ❌ Connection attempt ${attempt} failed: ${err.message}`);
        if (attempt < retries) {
          logger.info(`[MongoDB] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          logger.error(`[MongoDB] ❌ All ${retries} connection attempts failed. Database is currently DISCONNECTED.`);
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

export function getDbStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  const isAtlas = MONGODB_URI.includes('mongodb+srv://') || MONGODB_URI.includes('mongodb.net');
  const hasPlaceholders = MONGODB_URI.includes('<USERNAME>') || MONGODB_URI.includes('<PASSWORD>') || MONGODB_URI.includes('<CLUSTER>');

  return {
    isConnected: stateCode === 1,
    state: states[stateCode] || 'unknown',
    stateCode,
    host: mongoose.connection.host || null,
    databaseName: mongoose.connection.name || null,
    isAtlas,
    hasPlaceholderUri: hasPlaceholders,
    maskedUri: MONGODB_URI.replace(/\/\/[^@]*@/, '//***:***@'),
    lastError: lastConnectionError,
  };
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

// Note: Graceful shutdown is handled in server/index.js to coordinate
// HTTP server close and DB disconnect in the correct order.

// Connection event listeners
mongoose.connection.on('connected', () => {
  logger.info('[MongoDB] ✅ Connection established.');
});

mongoose.connection.on('error', (err) => {
  logger.error(`[MongoDB] ❌ Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('[MongoDB] ⚠️ Connection lost.');
});

mongoose.connection.on('reconnected', () => {
  logger.info('[MongoDB] ✅ Reconnected successfully.');
});

export { mongoose };

