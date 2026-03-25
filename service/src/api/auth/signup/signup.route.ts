import { RoutersTypes } from '../../../types/routes'
import {
  requestAccess,
  signup,
  signupFromRequestAccess,
} from './signup.controller'
import {
  requestAccessSchema,
  signupRequestAccessSchema,
  signupSchema,
} from './signup.validate'

const signupRoutes: RoutersTypes[] = [
  {
    route: '/signup',
    method: 'post',
    validate: {
      type: 'body',
      schema: signupSchema,
    },
    handler: signup,
  },
  {
    route: '/request-access',
    method: 'post',
    validate: {
      type: 'body',
      schema: requestAccessSchema,
    },
    handler: requestAccess,
  },
  {
    route: '/signup/request-access',
    method: 'post',
    validate: {
      type: 'body',
      schema: signupRequestAccessSchema,
    },
    handler: signupFromRequestAccess,
  },
]

export default signupRoutes
