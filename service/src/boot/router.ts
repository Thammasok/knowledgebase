import express, { Application, Router } from 'express'
import logger from './logger'
import validator from './validator'
import routerLists from '../api/routes'
import * as authMiddleware from '../middleware/auth.middleware'

type RouteMethodTypes = 'get' | 'post' | 'put' | 'delete' | 'patch'

function generateRoute(app: Application) {
  const router: Router = express.Router()

  if (routerLists.length === 0) {
    throw new TypeError('Invalid routers object provided')
  } else {
    routerLists.forEach(({ version, path, routers }) => {
      routers.forEach((route: any) => {
        const {
          method,
          route: routePath,
          auth = false,
          middleware: _middleware = [],
          validate,
          handler,
          useRefreshToken = false,
        } = route

        const apiPath = `/api/v${version}/${path}${routePath === '/' ? '' : routePath}`
        const middleware = [handler]

        logger.info(`[${method.toLocaleUpperCase()}]: ${apiPath}`)

        // Build middleware chain: validator → auth → custom middleware → handler
        // Custom middleware runs AFTER auth so req.account is available.

        // Validator (outermost)
        if (validate) {
          middleware.unshift(validator(validate))
        }

        // Custom middleware inserted between auth and handler
        if (_middleware.length > 0) {
          middleware.splice(validate ? 1 : 0, 0, ..._middleware)
        }

        // Authentication (runs before handler and custom middleware)
        if (auth) {
          const authPos = validate ? 1 : 0
          if (useRefreshToken) {
            middleware.splice(authPos, 0, authMiddleware.authRefreshMiddleware)
          } else {
            middleware.splice(authPos, 0, authMiddleware.authAccessMiddleware)
          }
        }

        // Methods
        switch (method.toLowerCase() as RouteMethodTypes) {
          case 'get':
            router.get(apiPath, ...middleware)
            break
          case 'post':
            router.post(apiPath, ...middleware)
            break
          case 'put':
            router.put(apiPath, ...middleware)
            break
          case 'delete':
            router.delete(apiPath, ...middleware)
            break
          case 'patch':
            router.patch(apiPath, ...middleware)
            break
          default:
            throw new Error(`Invalid HTTP method: ${method}`)
        }
      })
    })
  }

  app.use(router)
}

export default generateRoute
