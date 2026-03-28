import { RouteTypes } from '../../types/routes'
import { createFolderSchema, updateFolderSchema } from './folder.validate'
import * as FolderController from './folder.controller'
import { workspaceGuard, roleGuard } from '../../middleware/workspace-guard.middleware'

const folderRouters: RouteTypes = {
  version: '1',
  path: 'workspace',
  routers: [
    {
      route: '/:workspaceId/folder',
      method: 'get',
      auth: true,
      middleware: [workspaceGuard],
      handler: FolderController.getFolders,
    },
    {
      route: '/:workspaceId/folder',
      method: 'post',
      auth: true,
      middleware: [workspaceGuard, roleGuard('member')],
      validate: { type: 'body', schema: createFolderSchema },
      handler: FolderController.createFolder,
    },
    {
      route: '/:workspaceId/folder/:folderId',
      method: 'patch',
      auth: true,
      middleware: [workspaceGuard, roleGuard('member')],
      validate: { type: 'body', schema: updateFolderSchema },
      handler: FolderController.updateFolder,
    },
    {
      route: '/:workspaceId/folder/:folderId',
      method: 'delete',
      auth: true,
      middleware: [workspaceGuard, roleGuard('member')],
      handler: FolderController.deleteFolder,
    },
  ],
}

export default folderRouters
