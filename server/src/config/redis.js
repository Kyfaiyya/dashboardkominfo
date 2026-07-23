import Redis from 'ioredis';
import config from './env.js';
import { logger } from '../utils/logger.js';

// Main client for cache operations (GET, SET, SETEX, DEL)
const redisClient = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 5000);
    logger.warn(`Redis reconnecting... attempt ${times}, delay ${delay}ms`);
    return delay;
  },
  lazyConnect: true,
});

// Separate client for pub/sub (required by Redis — pub/sub client can't do regular commands)
const redisPub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 200, 5000);
  },
  lazyConnect: true,
});

const redisSub = new Redis(config.redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 200, 5000);
  },
  lazyConnect: true,
});

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

// Cache TTL in seconds (5 minutes — data survives if API is briefly down)
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
  await redisClient.quit();
  await redisPub.quit();
  await redisSub.quit();
  logger.info('Redis disconnected');
}

export { redisClient, redisPub, redisSub };
