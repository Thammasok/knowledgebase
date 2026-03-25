const jwtConfig = {
  JWT: {
    JWT_SECRET: process.env.JWT_SECRET || '',
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
}

export default jwtConfig
