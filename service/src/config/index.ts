import accountConfig from './account'
import appConfig from './app'
import jwtConfig from './jwt'
import mailConfig from './mail'
import passwordConfig from './password'
import authConfig from './auth'
import servicesConfig from './service'
import googleConfig from './google'

const config = {
  ...appConfig,
  ...jwtConfig,
  ...mailConfig,
  ...passwordConfig,
  ...accountConfig,
  ...authConfig,
  ...servicesConfig,
  ...googleConfig,
}

export default config
