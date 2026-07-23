import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import config from './config/env.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { setupSocketIO } from './socket/handler.js';
import { startScheduler, stopScheduler } from './scheduler/cron-jobs.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { getCachedData, getHistoricalData } from './services/data-service.js';
import { logger } from './utils/logger.js';

const app = express();
const httpServer = createServer(app);

// --- Middleware ---
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// --- Health check endpoint ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// --- REST endpoints for testing & fallback ---

// 1. Mock API Lembaga Eksternal (menstimulasikan API lembaga)
app.get('/mock-api/data', async (req, res, next) => {
  try {
    const { generateMockData } = await import('./adapter/mock-data.js');
    res.json({
      status: 'success',
      source: 'Mock Lembaga Eksternal API',
      timestamp: new Date().toISOString(),
      data: generateMockData(),
    });
  } catch (err) {
    next(err);
  }
});

// 2. Trigger manual fetch & broadcast realtime ke frontend
app.all('/api/trigger', async (req, res, next) => {
  try {
    const { processNewData } = await import('./services/data-service.js');
    const newData = await processNewData();
    res.json({
      message: '⚡ Manual poll triggered & broadcast to frontend via Socket.IO!',
      timestamp: new Date().toISOString(),
      data: newData,
    });
  } catch (err) {
    next(err);
  }
});

// 3. Status data terkini dari Redis cache
app.get('/api/data/latest', async (req, res, next) => {
  try {
    const data = await getCachedData();
    if (!data) {
      return res.status(503).json({ error: 'No data available yet' });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// 4. Data historis dari TimescaleDB
app.get('/api/data/history/:metricType', async (req, res, next) => {
  try {
    const { metricType } = req.params;
    const { range = '24h' } = req.query;
    const data = await getHistoricalData(metricType, range);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

// --- Error handlers ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Startup sequence ---
async function start() {
  try {
    // 1. Connect infrastructure
    logger.info('🚀 Starting dashboard backend...');

    try {
      await connectRedis();
    } catch (err) {
      logger.warn('⚠️ Redis unavailable — running without cache/pub-sub:', err.message);
    }

    try {
      await connectDatabase();
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
