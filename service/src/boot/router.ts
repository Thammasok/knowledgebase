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

        // Authentication
        if (auth) {
          if (useRefreshToken) {
            middleware.unshift(authMiddleware.authRefreshMiddleware)
          } else {
            middleware.unshift(authMiddleware.authAccessMiddleware)
          }
        }

        // Middleware
        if (_middleware.length > 0) {
          middleware.unshift(..._middleware)
        }

        // Validator
        if (validate) {
          middleware.unshift(validator(validate))
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
