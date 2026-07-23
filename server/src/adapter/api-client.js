import axios from 'axios';
import axiosRetry from 'axios-retry';
import config from '../config/env.js';
import { logger } from '../utils/logger.js';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.externalApi.url,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(config.externalApi.key && {
      'X-API-Key': config.externalApi.key,
    }),
  },
});

// Configure retry with exponential backoff
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
    logger.warn(`API retry #${retryCount}, waiting ${delay}ms`);
    return delay;
  },
  retryCondition: (error) => {
    // Retry on network errors, 5xx, 429 (rate limit)
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429 ||
      (error.response?.status >= 500 && error.response?.status <= 599)
    );
  },
  onRetry: (retryCount, error) => {
    logger.warn(`Retrying API call (attempt ${retryCount}): ${error.message}`);
  },
});

// Request interceptor — log outgoing requests
apiClient.interceptors.request.use(
  (reqConfig) => {
    logger.debug(`→ API Request: ${reqConfig.method?.toUpperCase()} ${reqConfig.baseURL}`);
    reqConfig.metadata = { startTime: Date.now() };
    return reqConfig;
  },
  (error) => {
    logger.error('API request error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor — log timing & status
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
    logger.debug(`← API Response: ${response.status} (${duration}ms)`);
    return response;
  },
  (error) => {
    const duration = Date.now() - (error.config?.metadata?.startTime || Date.now());
    logger.error(`← API Error: ${error.response?.status || 'NETWORK'} (${duration}ms) - ${error.message}`);
    return Promise.reject(error);
  }
);

/**
 * Fetch latest data from the external API
 * @returns {Promise<object>} Raw API response data
 */
export async function fetchLatestData() {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch data from external API after all retries:', error.message);
    throw error;
  }
}

export default apiClient;
