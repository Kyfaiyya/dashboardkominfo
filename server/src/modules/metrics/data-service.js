import { fetchLatestData } from '../../adapter/api-client.js';
import { generateMockData } from '../../adapter/mock-data.js';
import { normalizeData } from '../../adapter/normalizer.js';
import { redisPub, CHANNELS } from '../../config/redis.js';
import { MetricModel } from './metric.model.js';
import { PegawaiModel } from '../bkpsdm/pegawai.model.js';
import config from '../../config/env.js';
import { logger } from '../../utils/logger.js';

/**
 * Main data pipeline service: fetch → normalize → cache → store → broadcast
 */
export async function processNewData() {
  let rawData;

  // 1. Fetch raw data from adapter or mock
  try {
    if (config.useMockApi) {
      rawData = generateMockData();
      logger.debug('Using mock data generator');
    } else {
      rawData = await fetchLatestData();
    }
  } catch (err) {
    logger.error('Data fetch failed, serving cached data:', err.message);
    return null;
  }

  // 2. Normalize raw payload
  const normalized = normalizeData(rawData);

  // 3. Cache via MetricModel
  await MetricModel.setCachedMetrics(normalized);

  // 4. Store historical & records via Models
  const now = new Date();
  try {
    await MetricModel.insertMetricReadings(normalized.metrics, now);
  } catch (err) {
    logger.error('TimescaleDB metric insert failed:', err.message);
  }

  try {
    if (Array.isArray(normalized.samplePegawai)) {
      await PegawaiModel.upsertPegawaiRecords(normalized.samplePegawai, now);
    }
    await PegawaiModel.logApiFetch(
      normalized.samplePegawai ? normalized.samplePegawai.length : 0,
      { metrics_count: normalized.metrics?.length || 0, timestamp: normalized.timestamp },
      now
    );
  } catch (err) {
    logger.error('Pegawai/Audit database store failed:', err.message);
  }

  // 5. Broadcast via Redis Pub/Sub
  try {
    await redisPub.publish(CHANNELS.DATA_UPDATE, JSON.stringify(normalized));
    logger.debug('Data broadcast via pub/sub');
  } catch (err) {
    logger.error('Redis publish failed:', err.message);
  }

  return normalized;
}

/**
 * Get all cached metrics from Redis
 */
export async function getCachedData() {
  return await MetricModel.getCachedMetrics();
}

/**
 * Get historical metrics from DB
 */
export async function getHistoricalData(metricType, timeRange = '24h') {
  return await MetricModel.getHistoricalMetrics(metricType, timeRange);
}
