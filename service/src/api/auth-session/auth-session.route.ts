import { RouteTypes } from '../../types/routes'
import {
  deactivateAuthSession,
  getSessionLists,
} from './auth-session.controller'

const authSessionRouters: RouteTypes = {
  version: '1',
  path: 'auth-session',
  routers: [
    {
      route: '/',
      method: 'get',
      auth: true,
      handler: getSessionLists,
    },
    {
      route: '/deactivate/:id',
      method: 'delete',
      auth: true,
      handler: deactivateAuthSession,
    },
  ],
}

export default authSessionRouters
