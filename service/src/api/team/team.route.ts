import { RouteTypes } from '../../types/routes'
import { createTeamSchema, getTeamsSchema, updateTeamSchema } from './team.validate'
import * as TeamController from './team.controller'

const teamRouters: RouteTypes = {
  version: '1',
  path: 'team',
  routers: [
    {
      route: '/',
      method: 'get',
      auth: true,
      validate: { type: 'query', schema: getTeamsSchema },
      handler: TeamController.getTeams,
    },
    {
      route: '/',
      method: 'post',
      auth: true,
      validate: {
        type: 'body',
        schema: createTeamSchema,
      },
      handler: TeamController.createTeam,
    },
    {
      route: '/:id',
      method: 'patch',
      auth: true,
      validate: {
        type: 'body',
        schema: updateTeamSchema,
      },
      handler: TeamController.updateTeam,
    },
  ],
}

export default teamRouters
