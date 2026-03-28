const appConfig = {
  APP_KEY: process.env.APP_KEY || 'san-ai-all-service',
  APP_NAME: process.env.APP_NAME || 'SAN AI',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || '0.0.0.0',
  IS_API_TEST: process.env.ENABLE_API_TEST || false,
  ALLOWED_ORIGIN: {
    CLIENT_URL: process.env.ALLOWED_ORIGIN_CLIENT_URL || '',
  },
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  EXTERNAL_API: {
    IP_API_URL: process.env.IP_API_URL || 'https://freeipapi.com/api/json',
  },
}

export default appConfig
