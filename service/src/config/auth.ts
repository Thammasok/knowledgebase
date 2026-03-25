const sessionConfig = {
  AUTH: {
    SESSION: {
      MAX_DEVICE_LOGIN: 4,
    },
  },
  ADMIN: process.env.ADMIN_LIST?.split(',') || [],
}

export default sessionConfig
