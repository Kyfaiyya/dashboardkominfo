import Redis from 'ioredis';
import config from './env.js';
import { logger } from '../utils/logger.js';

// Main client for cache operations
const redisClient = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) return null; // Stop retrying after 3 attempts
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true,
  enableOfflineQueue: false,
});

// Separate client for pub/sub
const redisPub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true,
  enableOfflineQueue: false,
});

const redisSub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  },
  lazyConnect: true,
  enableOfflineQueue: false,
});

// Attach silent error listeners to prevent uncaught EventEmitter errors when Redis is offline
redisClient.on('error', (err) => logger.debug('Redis client error (offline):', err.message));
redisPub.on('error', (err) => logger.debug('Redis pub error (offline):', err.message));
redisSub.on('error', (err) => logger.debug('Redis sub error (offline):', err.message));

// Cache key constants
export const CACHE_KEYS = {
  METRICS: 'dashboard:latest:metrics',
  ENERGY_CHART: 'dashboard:latest:energy_chart',
  TRAFFIC_CHART: 'dashboard:latest:traffic_chart',
  STATS: 'dashboard:latest:stats',
  PROJECTS: 'dashboard:latest:projects',
  DATASETS: 'dashboard:latest:datasets',
  LAST_UPDATE: 'dashboard:last_update',
};

// Pub/sub channel
export const CHANNELS = {
  DATA_UPDATE: 'dashboard:update',
};

// Cache TTL in seconds (5 minutes)
export const CACHE_TTL = 300;

/**
 * Connect all Redis clients
 */
export async function connectRedis() {
  try {
    await redisClient.connect();
    await redisPub.connect();
    await redisSub.connect();
    logger.info('✅ Redis connected (cache + pub/sub)');
  } catch (err) {
    logger.error('❌ Redis connection failed:', err.message);
    throw err;
  }
}

/**
 * Gracefully disconnect all Redis clients
 */
export async function disconnectRedis() {
  try {
    await redisClient.quit();
    await redisPub.quit();
    await redisSub.quit();
    logger.info('Redis disconnected');
  } catch (e) { /* ignore */ }
}

export { redisClient, redisPub, redisSub };
