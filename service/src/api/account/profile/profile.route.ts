import { RoutersTypes } from '../../../types/routes'
import {
  getAccountProfile,
  updateAccountProfile,
} from './profile.controller'
import { updateProfileSchema } from './profile.validate'

const profileRouters: RoutersTypes[] = [
  {
    route: '/',
    method: 'get',
    auth: true,
    handler: getAccountProfile,
  },
  {
    route: '/',
    method: 'patch',
    auth: true,
    validate: {
      type: 'body',
      schema: updateProfileSchema,
    },
    handler: updateAccountProfile,
  },
]

export default profileRouters
