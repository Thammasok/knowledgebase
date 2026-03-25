const googleConfig = {
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    REDIRECT_URI:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:3030/api/v1/auth/google/callback',
    FRONTEND_CALLBACK_URL:
      process.env.GOOGLE_FRONTEND_CALLBACK_URL ||
      'http://localhost:3000/auth/google/callback',
  },
}

export default googleConfig
