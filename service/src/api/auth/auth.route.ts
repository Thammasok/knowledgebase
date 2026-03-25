import { RouteTypes } from '../../types/routes'
import signupRoutes from './signup/signup.route'
import otpRoutes from './otp/otp.route'
import loginRoutes from './login/login.route'
import forgotRoutes from './forgot/forgot.route'
import oauthRoutes from './oauth/oauth.route'

const authRouters: RouteTypes = {
  version: '1',
  path: 'auth',
  routers: [
    ...signupRoutes,
    ...otpRoutes,
    ...loginRoutes,
    ...forgotRoutes,
    ...oauthRoutes,
  ],
}

export default authRouters
