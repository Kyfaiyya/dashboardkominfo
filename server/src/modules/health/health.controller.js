import config from '../../config/env.js';

/**
 * Health Controller - Server health check endpoint handler
 */
export function getHealthStatus(req, res) {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
}
