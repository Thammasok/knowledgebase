import appConfig from "./app"

const mailConfig = {
  MAIL: {
    MAIL_API_KEY: process.env.MAIL_API_KEY || '',
    IS_SANDBOX: process.env.MAIL_IS_SANDBOX === 'true',
    TEST_SANDBOX_ID: process.env.MAIL_TEST_SANDBOX_ID ? Number.parseInt(process.env.MAIL_TEST_SANDBOX_ID) : null,
    MAIL_HOST: process.env.MAIL_HOST || 'smtp.gmail.com',
    MAIL_PORT: process.env.MAIL_PORT
      ? Number.parseInt(process.env.MAIL_PORT)
      : 587,
    MAIL_USER: process.env.MAIL_USER || '',
    MAIL_PASS: process.env.MAIL_PASS || '',
    MAIL_SECURE: process.env.MAIL_SECURE === 'true',
    MAIL_DEFAULT_FROM_EMAIL:
      process.env.MAIL_DEFAULT_FROM_EMAIL || 'postmaster@dvith.com',
    MAIL_DEFAULT_FROM_NANE: process.env.MAIL_DEFAULT_FROM_NANE || 'No Reply',
    OTP_EXPIRE_TIME: 10,
    OTP_EXPIRE_UNIT: 'minutes',
    MAIL_VERIFY_URL: process.env.MAIL_VERIFY_URL || '',
  },
  MAIL_TEMPLATE: {
    VERIFY_EMAIL_WITH_LINK: {
      SUBJECT: `Verify your account`,
      TEMPLATE_UUID: '385f2c94-a96e-4a50-ab4a-0103537ae905'
    },
    VERIFY_MAIL_WITH_OTP: {
      SUBJECT: 'Verify your account',
      TEMPLATE_UUID: '382812da-2f06-433b-a146-3ccffbcb1573',
    },
    REQUEST_RESET_PASSWORD: {
      SUBJECT: 'Request Reset Password',
      TEMPLATE_UUID: '33b50cc1-3c1a-47ae-b0b7-e109e0edbb42',
    }
  },
}

export default mailConfig
