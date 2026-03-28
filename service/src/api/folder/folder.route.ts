import { RouteTypes } from '../../types/routes'
import { createFolderSchema, updateFolderSchema } from './folder.validate'
import * as FolderController from './folder.controller'

const folderRouters: RouteTypes = {
  version: '1',
  path: 'workspace',
  routers: [
    {
      route: '/:workspaceId/folder',
      method: 'get',
      auth: true,
      handler: FolderController.getFolders,
    },
    {
      route: '/:workspaceId/folder',
      method: 'post',
      auth: true,
      validate: { type: 'body', schema: createFolderSchema },
      handler: FolderController.createFolder,
    },
    {
      route: '/:workspaceId/folder/:folderId',
      method: 'patch',
      auth: true,
      validate: { type: 'body', schema: updateFolderSchema },
      handler: FolderController.updateFolder,
    },
    {
      route: '/:workspaceId/folder/:folderId',
      method: 'delete',
      auth: true,
      handler: FolderController.deleteFolder,
    },
  ],
}

export default folderRouters
