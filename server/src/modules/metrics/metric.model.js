import { redisClient, CACHE_KEYS, CACHE_TTL } from '../../config/redis.js';
import db from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/**
 * Metric Model - Handles Redis Cache and PostgreSQL/TimescaleDB metric operations
 */
export class MetricModel {
  /**
   * Save normalized metrics data into Redis Cache
   */
  static async setCachedMetrics(normalized) {
    try {
      if (['end', 'close'].includes(redisClient.status)) {
        await redisClient.connect().catch(() => {});
      }
      if (redisClient.status !== 'ready') return;

      const pipeline = redisClient.pipeline();
      pipeline.setex(CACHE_KEYS.METRICS, CACHE_TTL, JSON.stringify(normalized.metrics));
      pipeline.setex(CACHE_KEYS.ENERGY_CHART, CACHE_TTL, JSON.stringify(normalized.energyChart));
      pipeline.setex(CACHE_KEYS.TRAFFIC_CHART, CACHE_TTL, JSON.stringify(normalized.trafficChart));
      pipeline.setex(CACHE_KEYS.STATS, CACHE_TTL, JSON.stringify(normalized.stats));
      pipeline.setex(CACHE_KEYS.PROJECTS, CACHE_TTL, JSON.stringify(normalized.projects));
      pipeline.setex(CACHE_KEYS.DATASETS, CACHE_TTL, JSON.stringify(normalized.datasets));
      pipeline.set(CACHE_KEYS.LAST_UPDATE, normalized.timestamp);
      await pipeline.exec();
      logger.debug('Data cached in Redis successfully');
    } catch (err) {
      logger.debug('Redis cache write skipped:', err.message);
    }
  }

  /**
   * Get cached metrics data from Redis
   */
  static async getCachedMetrics() {
    try {
      if (['end', 'close'].includes(redisClient.status)) {
        await redisClient.connect().catch(() => {});
      }
      if (redisClient.status !== 'ready') return null;

      const pipeline = redisClient.pipeline();
      pipeline.get(CACHE_KEYS.METRICS);
      pipeline.get(CACHE_KEYS.ENERGY_CHART);
      pipeline.get(CACHE_KEYS.TRAFFIC_CHART);
      pipeline.get(CACHE_KEYS.STATS);
      pipeline.get(CACHE_KEYS.PROJECTS);
      pipeline.get(CACHE_KEYS.DATASETS);
      pipeline.get(CACHE_KEYS.LAST_UPDATE);
      const results = await pipeline.exec();

      const [metrics, energyChart, trafficChart, stats, projects, datasets, lastUpdate] =
        results.map(([err, val]) => val);

      if (!metrics) return null;

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
      logger.debug('Failed to read cached data from Redis:', err.message);
      return null;
    }
  }

  /**
   * Save time-series metric readings to TimescaleDB / PostgreSQL
   */
  static async insertMetricReadings(metrics = [], timestamp = new Date()) {
    const rows = metrics.map((metric) => ({
      time: timestamp,
      metric_type: metric.id,
      value: metric.numericValue,
      unit: metric.id === 'totalAsn' ? 'count' : metric.id === 'simpegUptime' ? 'percent' : 'count',
      metadata: JSON.stringify({ label: metric.label, trend: metric.trend }),
    }));

    if (rows.length > 0) {
      await db('metric_readings').insert(rows);
      logger.info(`✅ Stored ${rows.length} metric readings in database`);
    }
  }

  /**
   * Query historical metric readings from TimescaleDB / PostgreSQL
   */
  static async getHistoricalMetrics(metricType, timeRange = '24h') {
    const interval = timeRange === '7d' ? '7 days'
      : timeRange === '30d' ? '30 days'
      : '24 hours';

    try {
      return await db('metric_readings')
        .select('time', 'metric_type', 'value', 'unit', 'metadata')
        .where('metric_type', metricType)
        .where('time', '>', db.raw(`NOW() - INTERVAL '${interval}'`))
        .orderBy('time', 'asc');
    } catch (err) {
      logger.error(`Historical query failed for ${metricType}:`, err.message);
      return [];
    }
  }
}
