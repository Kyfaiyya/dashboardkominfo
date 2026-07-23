import cron from 'node-cron';
import config from '../config/env.js';
import { processNewData } from '../services/data-service.js';
import { logger } from '../utils/logger.js';

let scheduledTask = null;

/**
 * Start the polling scheduler.
 * Uses node-cron with the expression from POLL_CRON env var.
 * Default polling: every 30 seconds
 */
export function startScheduler() {
  const cronExpression = config.pollCron;

  if (!cron.validate(cronExpression)) {
    logger.error(`Invalid cron expression: ${cronExpression}`);
    throw new Error(`Invalid POLL_CRON: ${cronExpression}`);
  }

  logger.info(`📅 Scheduler starting with cron: "${cronExpression}"`);

  // Run immediately on startup so dashboard isn't empty
  logger.info('Running initial data fetch...');
  processNewData()
    .then((data) => {
      if (data) {
        logger.info('✅ Initial data fetch successful');
      } else {
        logger.warn('⚠️ Initial data fetch returned null (will retry on schedule)');
      }
    })
    .catch((err) => {
      logger.error('Initial data fetch failed:', err.message);
    });

  // Schedule recurring polls
  scheduledTask = cron.schedule(cronExpression, async () => {
    logger.info('⏰ Scheduled poll triggered');
    try {
      const data = await processNewData();
      if (data) {
        logger.info(`✅ Poll successful — ${data.metrics.length} metrics updated`);
      } else {
        logger.warn('⚠️ Poll returned null — serving cached data');
      }
    } catch (err) {
      logger.error('Scheduled poll error:', err.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Jakarta',
  });

  logger.info('📅 Scheduler running');
}

/**
 * Stop the scheduler gracefully
 */
export function stopScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    logger.info('Scheduler stopped');
  }
}
