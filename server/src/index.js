import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import config from './config/env.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { setupSocketIO } from './socket/handler.js';
import { startScheduler, stopScheduler } from './scheduler/cron-jobs.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { logger } from './utils/logger.js';
import routes from './routes/index.js';

const app = express();
const httpServer = createServer(app);

// --- Middleware ---
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// --- Main Application Routes (MVC Architecture) ---
app.use('/', routes);

// --- Error handlers ---
app.use(notFoundHandler);
app.use(errorHandler);

// Helper to run connection with timeout
function withTimeout(promise, ms, name) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${name} connection timeout (${ms}ms)`)), ms)
    ),
  ]);
}

// --- Startup sequence ---
async function start() {
  try {
    logger.info('🚀 Starting dashboard backend (MVC Architecture)...');

    // 1. Connect infrastructure (non-blocking timeouts)
    try {
      await withTimeout(connectRedis(), 2000, 'Redis');
    } catch (err) {
      logger.warn('⚠️ Redis unavailable — running without cache/pub-sub:', err.message);
    }

    try {
      await withTimeout(connectDatabase(), 2000, 'Database');
    } catch (err) {
      logger.warn('⚠️ Database unavailable — running without historical storage:', err.message);
    }

    // 2. Setup Socket.IO
    setupSocketIO(httpServer);

    // 3. Start scheduler
    startScheduler();

    // 4. Listen
    httpServer.listen(config.port, () => {
      logger.info(`✅ Server running on http://localhost:${config.port}`);
      logger.info(`   Mode: ${config.nodeEnv}`);
      logger.info(`   Mock API: ${config.useMockApi ? 'ON' : 'OFF'}`);
      logger.info(`   Frontend: ${config.frontendUrl}`);
    });
  } catch (err) {
    logger.error('❌ Server startup failed:', err);
    process.exit(1);
  }
}

// --- Graceful shutdown ---
async function shutdown(signal) {
  logger.info(`\n${signal} received — shutting down gracefully...`);
  stopScheduler();

  httpServer.close(async () => {
    try {
      await disconnectRedis();
    } catch (e) { /* already logged */ }

    try {
      await disconnectDatabase();
    } catch (e) { /* already logged */ }

    logger.info('👋 Server shut down cleanly');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
