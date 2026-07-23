import { logger } from '../utils/logger.js';

/**
 * Global Express error handling middleware
 */
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.path} → ${statusCode}: ${message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
    },
  });
}
