import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { connectDB, disconnectDB, getDbStatus, ensureDbConnected } from './config/db.js';
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'Cache-Control', 'Pragma', 'X-Requested-With', 'Accept'],
}));

// Payload Limiters & Sanitizers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitizer);

// Vercel Serverless URL Path Normalizer
app.use((req, _res, next) => {
  if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '');
    if (!req.url) req.url = '/';
  }
  next();
});

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

// Public QR Scan Redirect & Analytics Logging Endpoints
app.get('/r/:token', resolveScan);
app.get('/api/r/:token', resolveScan);

// Health check endpoints
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), database: getDbStatus() });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), database: getDbStatus() });
});

app.get('/api/db-debug', async (_req, res) => {
  let connError = null;
  try {
    await ensureDbConnected();
  } catch (err) {
    connError = err.message;
  }
  const dbStatus = getDbStatus();
  return res.json({
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    db: mongoose.connection.name || null,
    models: mongoose.modelNames(),
    uriExists: !!process.env.MONGODB_URI,
    maskedUri: dbStatus?.maskedUri || null,
    connectionError: connError || dbStatus?.lastError || null,
  });
});

// Prevent API response caching across devices & browsers
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Mount main API router
app.use('/api', routes);

// Serve static assets from dist directory if available
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// SPA fallback for non-API routes (e.g. /hotel-slug)
app.get('{*path}', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/r/')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

let server = null;

// Start server (skip only on Vercel where serverless handler is used)
if (process.env.VERCEL !== '1') {
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
