import { RouteTypes } from '../../types/routes'
import profileRouters from './profile/profile.route'
import settingRouters from './setting/setting.route'

const accountRouters: RouteTypes = {
  version: '1',
  path: 'account',
  routers: [...profileRouters, ...settingRouters],
}

export default accountRouters
