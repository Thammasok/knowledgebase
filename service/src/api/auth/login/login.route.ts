import { RoutersTypes } from '../../../types/routes'
import { loginSchema } from './login.validate'
import * as LoginController from './login.controller'

const loginRoutes: RoutersTypes[] = [
  {
    route: '/login',
    method: 'post',
    validate: {
      type: 'body',
      schema: loginSchema,
    },
    handler: LoginController.login,
  },
  {
    route: '/refresh',
    method: 'post',
    auth: true,
    useRefreshToken: true,
    handler: LoginController.refreshToken,
  },
  {
    route: '/logout',
    method: 'post',
    auth: true,
    handler: LoginController.logout,
  },
]

export default loginRoutes
