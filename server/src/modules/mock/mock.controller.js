import { generateMockData } from '../../adapter/mock-data.js';

/**
 * Mock Controller - Simulates external lembaga API responses
 */
export function getMockData(req, res, next) {
  try {
    res.json({
      status: 'success',
      source: 'Mock Lembaga Eksternal API',
      timestamp: new Date().toISOString(),
      data: generateMockData(),
    });
  } catch (err) {
    next(err);
  }
}
