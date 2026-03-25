import { RouteTypes } from '../../types/routes'
import HealthController from './health.controller'

const authRouters: RouteTypes = {
  version: '1',
  path: 'health',
  routers: [
    {
      route: '/',
      method: 'get',
      handler: HealthController.healthCheck,
    },
  ],
}

export default authRouters
