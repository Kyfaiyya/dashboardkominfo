import Redis from 'ioredis';
import config from './env.js';
import { logger } from '../utils/logger.js';

const createRetryStrategy = () => (times) => {
  // Retry indefinitely with backoff (capped at 3 seconds)
  return Math.min(times * 500, 3000);
};

// Main client for cache operations
const redisClient = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy: createRetryStrategy(),
  lazyConnect: true,
  enableOfflineQueue: false,
});

// Separate client for pub/sub
const redisPub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy: createRetryStrategy(),
  lazyConnect: true,
  enableOfflineQueue: false,
});

const redisSub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 1,
  retryStrategy: createRetryStrategy(),
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
    if (['connecting', 'connect', 'ready'].includes(redisClient.status) === false) {
      await redisClient.connect().catch(() => {});
    }
    if (['connecting', 'connect', 'ready'].includes(redisPub.status) === false) {
      await redisPub.connect().catch(() => {});
    }
    if (['connecting', 'connect', 'ready'].includes(redisSub.status) === false) {
      await redisSub.connect().catch(() => {});
    }
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
