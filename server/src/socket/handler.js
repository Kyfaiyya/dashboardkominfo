import { Server } from 'socket.io';
import { redisSub, CHANNELS } from '../config/redis.js';
import { getCachedData } from '../services/data-service.js';
import config from '../config/env.js';
import { logger } from '../utils/logger.js';

let io = null;

/**
 * Initialize Socket.IO server and wire up event handlers.
 *
 * @param {import('http').Server} httpServer - Node HTTP server
 * @returns {Server} Socket.IO server instance
 */
export function setupSocketIO(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: true, // Allow any local dev origin (localhost, 127.0.0.1, etc.)
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Reconnection settings for resilience
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // --- Client connection handler ---
  io.on('connection', async (socket) => {
    logger.info(`🔌 Client connected: ${socket.id} (total: ${io.engine.clientsCount})`);

    // Send cached data immediately so client isn't empty
    try {
      const cached = await getCachedData();
      if (cached) {
        socket.emit('data:initial', cached);
        logger.debug(`Sent cached data to ${socket.id}`);
      }
    } catch (err) {
      logger.error(`Failed to send initial data to ${socket.id}:`, err.message);
    }

    // Client can request a full refresh
    socket.on('data:request-refresh', async () => {
      try {
        const cached = await getCachedData();
        if (cached) {
          socket.emit('data:initial', cached);
        }
      } catch (err) {
        logger.error('Refresh request failed:', err.message);
      }
    });

    // Client can request historical data
    socket.on('data:request-history', async ({ metricType, timeRange }, callback) => {
      try {
        const { getHistoricalData } = await import('../services/data-service.js');
        const history = await getHistoricalData(metricType, timeRange);
        if (typeof callback === 'function') {
          callback({ success: true, data: history });
        }
      } catch (err) {
        logger.error('History request failed:', err.message);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Health check / heartbeat
    socket.on('ping:client', () => {
      socket.emit('pong:server', { timestamp: Date.now() });
    });

    socket.on('disconnect', (reason) => {
      logger.info(`🔌 Client disconnected: ${socket.id} (reason: ${reason})`);
    });
  });

  // --- Redis pub/sub → Socket.IO broadcast ---
  redisSub.subscribe(CHANNELS.DATA_UPDATE, (err) => {
    if (err) {
      logger.error('Failed to subscribe to Redis channel:', err.message);
      return;
    }
    logger.info(`📡 Subscribed to Redis channel: ${CHANNELS.DATA_UPDATE}`);
  });

  redisSub.on('message', (channel, message) => {
    if (channel === CHANNELS.DATA_UPDATE) {
      try {
        const data = JSON.parse(message);
        // Broadcast to ALL connected clients
        io.emit('data:update', data);
        logger.debug(`📡 Broadcast data:update to ${io.engine.clientsCount} clients`);
      } catch (err) {
        logger.error('Failed to broadcast data:', err.message);
      }
    }
  });

  logger.info('🔌 Socket.IO server initialized');
  return io;
}

/**
 * Get Socket.IO instance (for use in other modules)
 */
export function getIO() {
  return io;
}
