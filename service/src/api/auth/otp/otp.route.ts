import { RoutersTypes } from '../../../types/routes'
import { sendOTPForVerifyEmail, verifyEmail } from './otp.controller'
import { otpForVerifyEmailSchema, verifyOtpEmailSchema } from './otp.validate'

const otpRoutes: RoutersTypes[] = [
  {
    route: '/verify/mail',
    method: 'post',
    validate: {
      type: 'body',
      schema: otpForVerifyEmailSchema,
    },
    handler: sendOTPForVerifyEmail,
  },
  {
    route: '/verify/mail',
    method: 'patch',
    validate: {
      type: 'body',
      schema: verifyOtpEmailSchema,
    },
    handler: verifyEmail,
  },
]

export default otpRoutes
