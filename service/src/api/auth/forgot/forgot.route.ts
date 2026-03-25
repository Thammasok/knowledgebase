import { RoutersTypes } from '../../../types/routes'
import {
  createNewPasswordSchema,
  forgotPasswordSchema,
} from './forgot.validate'
import * as ForgotController from './forgot.controller'

const forgotRoutes: RoutersTypes[] = [
  {
    route: '/forgot/mail',
    method: 'post',
    validate: {
      type: 'body',
      schema: forgotPasswordSchema,
    },
    handler: ForgotController.forgotPassword,
  },
  {
    route: '/password',
    method: 'post',
    validate: {
      type: 'body',
      schema: createNewPasswordSchema,
    },
    handler: ForgotController.createNewPassword,
  },
]

export default forgotRoutes
