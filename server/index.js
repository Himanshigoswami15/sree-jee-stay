import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB, disconnectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { helmetSecurity, mongoSanitizer, apiLimiter } from './middleware/security.js';
import { resolveScan } from './controllers/qrController.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security Headers & CORS
app.use(helmetSecurity);
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Payload Limiters & Sanitizers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitizer);

// Database Connection Middleware for Vercel Serverless Functions & Local Dev
app.use(async (_req, _res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB(1, 500);
    }
    next();
  } catch (err) {
    logger.warn(`[DB Middleware] Database connection unavailable: ${err.message}`);
    next();
  }
});

// General Rate Limiting
app.use('/api', apiLimiter);

// Public QR Scan Redirect & Analytics Logging Endpoint
app.get('/r/:token', resolveScan);

// Health check endpoints
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'JJ Review System Backend API',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount main API router
app.use('/api', routes);

// Centralized Error Handler Middleware
app.use(errorHandler);

let server = null;

// Start server locally (if not running on Vercel)
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production') {
  startServer().catch((err) => {
    logger.error(`[Server Startup Error]: ${err.message}`);
  });
}

async function startServer() {
  await connectDB();

  server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 JJ Review System running on port ${PORT} with MongoDB persistence.`);
  });
}

// Graceful Shutdown Handler
async function gracefulShutdown(signal) {
  logger.info(`[Server Shutdown] ${signal} signal received. Closing HTTP server & MongoDB connection...`);
  if (server) {
    server.close(async () => {
      logger.info('[Server Shutdown] HTTP server closed cleanly.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (err) => {
  logger.error(`[Uncaught Exception]: ${err.message}`, err);
});
process.on('unhandledRejection', (reason) => {
  logger.error(`[Unhandled Rejection]: ${reason}`);
});

export default app;
