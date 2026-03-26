const globalConfig = {
  app: {
    name: 'Know',
    description: 'Knowledge Learning and AI Integration',
    logoName: 'KNOW',
    logo: '/logo.png',
    logoIcon: '/favicon.ico',
  },
  session: {
    cookieKey: 'session',
    jwtSecret: process.env.NEXTAUTH_SECRET ?? 'happy-financial-secret',
    expiresIn: {
      jwt: '1d',
      cookie: 1, // 1 day
    },
    ignorePath: [
      '/auth/login',
      '/auth/signup',
      '/auth/signup/otp',
      '/auth/signup/complete',
      '/auth/request-access',
      '/auth/register-invite',
      '/auth/forgot',
      '/auth/reset-password',
      '/auth/oauth/callback',
      '/en',
      '/th',
    ],
  },
  localStorage: {
    sentEmailToOtp: 'temp-to',
  },
  image: {
    url: process.env.NEXT_IMAGE_URL ?? 'http://localhost:3000',
  },
  auth: {
    afterLoginUrl: '/dashboard',
    afterSignupUrl: '/auth/signup/complete',
    afterSignoutUrl: '/auth/login',
  },
  locale: {
    default: 'en',
    supported: [
      { key: 'en', label: 'English' },
      { key: 'th', label: 'ภาษาไทย' },
    ],
    nextLocal: 'NEXT_LOCALE',
  },
}

export default globalConfig
