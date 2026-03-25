const passwordConfig = {
  RESET_PASSWORD: {
    EXPIRE_TIME: 10,
    RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL || '',
  },
}

export default passwordConfig
