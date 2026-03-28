import { RouteTypes } from '../../../types/routes'
import { sendInvitationSchema, updateMemberRoleSchema, acceptInvitationSchema } from './collab.validate'
import * as CollabController from './collab.controller'
import { tierGuard } from '../../../middleware/tier-guard.middleware'
import { workspaceGuard, roleGuard } from '../../../middleware/workspace-guard.middleware'

const collabRouters: RouteTypes = {
  version: '1',
  path: 'workspace',
  routers: [
    // Members
    {
      route: '/:workspaceId/members',
      method: 'get',
      auth: true,
      middleware: [tierGuard('startup'), workspaceGuard],
      handler: CollabController.getMembers,
    },
    {
      route: '/:workspaceId/members/:memberId',
      method: 'patch',
      auth: true,
      middleware: [tierGuard('startup'), workspaceGuard, roleGuard('owner')],
      validate: { type: 'body', schema: updateMemberRoleSchema },
      handler: CollabController.updateMemberRole,
    },
    {
      route: '/:workspaceId/members/:memberId',
      method: 'delete',
      auth: true,
      middleware: [tierGuard('startup'), workspaceGuard, roleGuard('owner')],
      handler: CollabController.removeMember,
    },

    // Invitations
    {
      route: '/:workspaceId/invitations',
      method: 'post',
      auth: true,
      middleware: [tierGuard('startup'), workspaceGuard, roleGuard('owner')],
      validate: { type: 'body', schema: sendInvitationSchema },
      handler: CollabController.sendInvitation,
    },
    {
      route: '/invitations/accept',
      method: 'post',
      auth: true,
      validate: { type: 'body', schema: acceptInvitationSchema },
      handler: CollabController.acceptInvitation,
    },
    {
      route: '/invitations/:token',
      method: 'get',
      auth: true,
      handler: CollabController.getInvitationInfo,
    },
  ],
}

export default collabRouters
