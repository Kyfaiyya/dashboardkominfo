import { fetchLatestData } from '../adapter/api-client.js';
import { generateMockData } from '../adapter/mock-data.js';
import { normalizeData } from '../adapter/normalizer.js';
import { redisClient, redisPub, CACHE_KEYS, CACHE_TTL, CHANNELS } from '../config/redis.js';
import db from '../config/database.js';
import config from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Main data pipeline: fetch → normalize → cache → store → broadcast
 */
export async function processNewData() {
  let rawData;

  // 1. Fetch from external API or mock
  try {
    if (config.useMockApi) {
      rawData = generateMockData();
      logger.debug('Using mock data generator');
    } else {
      rawData = await fetchLatestData();
    }
  } catch (err) {
    logger.error('Data fetch failed, serving cached data:', err.message);
    return null; // Caller should serve cache
  }

  // 2. Normalize
  const normalized = normalizeData(rawData);

  // 3. Cache in Redis
  try {
    const pipeline = redisClient.pipeline();
    pipeline.setex(CACHE_KEYS.METRICS, CACHE_TTL, JSON.stringify(normalized.metrics));
    pipeline.setex(CACHE_KEYS.ENERGY_CHART, CACHE_TTL, JSON.stringify(normalized.energyChart));
    pipeline.setex(CACHE_KEYS.TRAFFIC_CHART, CACHE_TTL, JSON.stringify(normalized.trafficChart));
    pipeline.setex(CACHE_KEYS.STATS, CACHE_TTL, JSON.stringify(normalized.stats));
    pipeline.setex(CACHE_KEYS.PROJECTS, CACHE_TTL, JSON.stringify(normalized.projects));
    pipeline.setex(CACHE_KEYS.DATASETS, CACHE_TTL, JSON.stringify(normalized.datasets));
    pipeline.set(CACHE_KEYS.LAST_UPDATE, normalized.timestamp);
    await pipeline.exec();
    logger.debug('Data cached in Redis');
  } catch (err) {
    logger.error('Redis cache write failed:', err.message);
    // Non-fatal — continue with store + broadcast
  }

  // 4. Store in TimescaleDB (historical)
  try {
    await storeHistorical(normalized);
  } catch (err) {
    logger.error('TimescaleDB insert failed:', err.message);
    // Non-fatal — continue with broadcast
  }

  // 5. Broadcast via Redis pub/sub
  try {
    await redisPub.publish(CHANNELS.DATA_UPDATE, JSON.stringify(normalized));
    logger.debug('Data broadcast via pub/sub');
  } catch (err) {
    logger.error('Redis publish failed:', err.message);
  }

  return normalized;
}

/**
 * Get all cached data from Redis (fallback when API is down)
 */
export async function getCachedData() {
  try {
    const pipeline = redisClient.pipeline();
    pipeline.get(CACHE_KEYS.METRICS);
    pipeline.get(CACHE_KEYS.ENERGY_CHART);
    pipeline.get(CACHE_KEYS.TRAFFIC_CHART);
    pipeline.get(CACHE_KEYS.STATS);
    pipeline.get(CACHE_KEYS.PROJECTS);
    pipeline.get(CACHE_KEYS.DATASETS);
    pipeline.get(CACHE_KEYS.LAST_UPDATE);
    const results = await pipeline.exec();

    // pipeline.exec returns [[err, result], ...]
    const [metrics, energyChart, trafficChart, stats, projects, datasets, lastUpdate] =
      results.map(([err, val]) => val);

    if (!metrics) return null; // No cache at all

    return {
      metrics: JSON.parse(metrics),
      energyChart: JSON.parse(energyChart),
      trafficChart: JSON.parse(trafficChart),
      stats: JSON.parse(stats),
      projects: JSON.parse(projects),
      datasets: JSON.parse(datasets),
      timestamp: lastUpdate,
    };
  } catch (err) {
    logger.error('Failed to read cached data:', err.message);
    return null;
  }
}

/**
 * Get historical metric data from TimescaleDB
 */
export async function getHistoricalData(metricType, timeRange = '24h') {
  const interval = timeRange === '7d' ? '7 days'
    : timeRange === '30d' ? '30 days'
    : '24 hours';

  try {
    const rows = await db('metric_readings')
      .select('time', 'metric_type', 'value', 'unit', 'metadata')
      .where('metric_type', metricType)
      .where('time', '>', db.raw(`NOW() - INTERVAL '${interval}'`))
      .orderBy('time', 'asc');
    return rows;
  } catch (err) {
    logger.error(`Historical query failed for ${metricType}:`, err.message);
    return [];
  }
}

/**
 * Insert normalized data as time-series rows
 */
async function storeHistorical(data) {
  const now = new Date();
  const rows = [];

  // Store each metric as a row
  for (const metric of data.metrics) {
    rows.push({
      time: now,
      metric_type: metric.id,
      value: metric.numericValue,
      unit: metric.id === 'citizens' ? 'count' : metric.id === 'air' ? 'aqi' : 'percent',
      metadata: JSON.stringify({ label: metric.label, trend: metric.trend }),
    });
  }

  if (rows.length > 0) {
    await db('metric_readings').insert(rows);
    logger.debug(`Stored ${rows.length} metric readings in TimescaleDB`);
  }
}
