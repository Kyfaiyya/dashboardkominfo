import { getCachedData, getHistoricalData, processNewData } from './data-service.js';

/**
 * Data Controller - Request handlers for dashboard metrics and triggering updates
 */

/**
 * GET /api/data/latest
 * Get status data from Redis cache
 */
export async function getLatestData(req, res, next) {
  try {
    const data = await getCachedData();
    if (!data) {
      return res.status(503).json({ error: 'No data available yet' });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/data/history/:metricType
 * Get historical metrics from DB
 */
export async function getHistory(req, res, next) {
  try {
    const { metricType } = req.params;
    const { range = '24h' } = req.query;
    const data = await getHistoricalData(metricType, range);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

/**
 * ALL /api/trigger
 * Manual data fetch trigger and realtime broadcast
 */
export async function triggerPoll(req, res, next) {
  try {
    const newData = await processNewData();
    res.json({
      message: '⚡ Manual poll triggered & broadcast to frontend via Socket.IO!',
      timestamp: new Date().toISOString(),
      data: newData,
    });
  } catch (err) {
    next(err);
  }
}
