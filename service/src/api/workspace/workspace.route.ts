import { RouteTypes } from '../../types/routes'
import { createWorkspaceSchema, getWorkspacesSchema, updateWorkspaceSchema } from './workspace.validate'
import * as WorkspaceController from './workspace.controller'

const workspaceRouters: RouteTypes = {
  version: '1',
  path: 'workspace',
  routers: [
    {
      route: '/',
      method: 'get',
      auth: true,
      validate: { type: 'query', schema: getWorkspacesSchema },
      handler: WorkspaceController.getWorkspaces,
    },
    {
      route: '/',
      method: 'post',
      auth: true,
      validate: {
        type: 'body',
        schema: createWorkspaceSchema,
      },
      handler: WorkspaceController.createWorkspace,
    },
    {
      route: '/:id',
      method: 'patch',
      auth: true,
      validate: {
        type: 'body',
        schema: updateWorkspaceSchema,
      },
      handler: WorkspaceController.updateWorkspace,
    },
  ],
}

export default workspaceRouters
