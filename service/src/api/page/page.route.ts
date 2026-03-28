import { RouteTypes } from '../../types/routes'
import { createPageSchema, updatePageSchema, updatePageContentSchema } from './page.validate'
import * as PageController from './page.controller'
import * as PageVersionController from './version/page-version.controller'
import { tierGuard } from '../../middleware/tier-guard.middleware'

const pageRouters: RouteTypes = {
  version: '1',
  path: 'workspace',
  routers: [
    {
      route: '/:workspaceId/page',
      method: 'get',
      auth: true,
      handler: PageController.getPages,
    },
    {
      route: '/:workspaceId/page',
      method: 'post',
      auth: true,
      validate: { type: 'body', schema: createPageSchema },
      handler: PageController.createPage,
    },
    {
      route: '/:workspaceId/page/:pageId',
      method: 'get',
      auth: true,
      handler: PageController.getPage,
    },
    {
      route: '/:workspaceId/page/:pageId',
      method: 'patch',
      auth: true,
      validate: { type: 'body', schema: updatePageSchema },
      handler: PageController.updatePage,
    },
    {
      route: '/:workspaceId/page/:pageId/content',
      method: 'patch',
      auth: true,
      validate: { type: 'body', schema: updatePageContentSchema },
      handler: PageController.updatePageContent,
    },
    {
      route: '/:workspaceId/page/:pageId',
      method: 'delete',
      auth: true,
      handler: PageController.deletePage,
    },
    {
      route: '/:workspaceId/page/:pageId/versions',
      method: 'get',
      auth: true,
      middleware: [tierGuard('personal')],
      handler: PageVersionController.getVersions,
    },
    {
      route: '/:workspaceId/page/:pageId/versions/:versionId/restore',
      method: 'post',
      auth: true,
      middleware: [tierGuard('personal')],
      handler: PageVersionController.restoreVersion,
    },
  ],
}

export default pageRouters
