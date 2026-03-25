import { RoutersTypes } from '../../../types/routes'
import { oauthSchema } from './oauth.validate'
import * as OAuthController from './oauth.controller'

const oauthRoutes: RoutersTypes[] = [
  {
    route: '/oauth',
    method: 'post',
    validate: {
      type: 'body',
      schema: oauthSchema,
    },
    handler: OAuthController.oauthSignIn,
  },
]

export default oauthRoutes
