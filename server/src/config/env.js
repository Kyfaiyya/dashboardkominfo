import 'dotenv/config';

const required = [
  'REDIS_URL',
  'DATABASE_URL',
  'PORT',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // External API
  externalApi: {
    url: process.env.EXTERNAL_API_URL || 'http://localhost:3001/mock-api/data',
    key: process.env.EXTERNAL_API_KEY || '',
  },

  // Redis
  redisUrl: process.env.REDIS_URL,

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // Polling
  pollCron: process.env.POLL_CRON || '*/30 * * * * *',

  // Mock mode
  useMockApi: process.env.USE_MOCK_API === 'true',
};

export default config;
