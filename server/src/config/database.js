import knex from 'knex';
import config from './env.js';
import { logger } from '../utils/logger.js';

const db = knex({
  client: 'pg',
  connection: config.databaseUrl,
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
  },
  // Log slow queries in development
  ...(config.nodeEnv === 'development' && {
    debug: false,
  }),
});

/**
 * Test database connection and log result
 */
export async function connectDatabase() {
  try {
    await db.raw('SELECT 1');
    logger.info('✅ PostgreSQL/TimescaleDB connected');
  } catch (err) {
    logger.error('❌ Database connection failed:', err.message);
    throw err;
  }
}

/**
 * Gracefully close database pool
 */
export async function disconnectDatabase() {
  await db.destroy();
  logger.info('Database disconnected');
}

export default db;
