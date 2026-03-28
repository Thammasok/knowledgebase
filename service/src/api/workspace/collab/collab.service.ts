import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'
import db from '../../../libs/db/prisma'
import { WorkspaceRole } from '../../../../generated/prisma/client'
import * as CollabRepository from './collab.repository'
import { sendInvitationEmail } from './collab.mail'
import config from '../../../config'

const INVITE_EXPIRY_DAYS = 7

// ─── Members ─────────────────────────────────────────────────────────────────

export const listMembers = async (workspaceId: string, ownerAccountId: string) => {
  const workspace = await db.workspace.findFirst({
    where: { id: workspaceId, isRemove: false },
    select: { accountId: true, account: { select: { id: true, displayName: true, email: true, image: true } } },
  })
  if (!workspace) {
    const error: any = new Error('Workspace not found')
    error.status = 404
    throw error
  }

  const invitedMembers = await CollabRepository.getMembersByWorkspaceId(workspaceId)

  // Prepend the owner as a synthetic entry
  const owner = {
    id: workspace.accountId,
    role: 'owner' as const,
    createdAt: null,
    account: workspace.account,
    isOwner: true,
  }

  return [owner, ...invitedMembers]
}

export const updateMemberRole = async (params: {
  memberId: string
  workspaceId: string
  role: WorkspaceRole
}) => {
  const member = await CollabRepository.getMemberById(params.memberId, params.workspaceId)
  if (!member) {
    const error: any = new Error('Member not found')
    error.status = 404
    throw error
  }

  return await CollabRepository.updateMemberRole(params.memberId, params.workspaceId, params.role)
}

export const removeMember = async (params: {
  memberId: string
  workspaceId: string
  requesterId: string
}) => {
  const workspace = await db.workspace.findFirst({
    where: { id: params.workspaceId, isRemove: false },
    select: { accountId: true },
  })

  if (!workspace) {
    const error: any = new Error('Workspace not found')
    error.status = 404
    throw error
  }

  // Check if requester is trying to remove the owner
  if (workspace.accountId === params.requesterId) {
    // Requester IS the owner — can remove members but not themselves (memberId cannot refer to owner)
    // The owner is not in WorkspaceMember, so if they try to delete memberId that's the owner account, it won't exist
  }

  const member = await CollabRepository.getMemberById(params.memberId, params.workspaceId)
  if (!member) {
    const error: any = new Error('Member not found')
    error.status = 404
    throw error
  }

  // TC-COLLAB-009: Owner cannot remove themselves
  if (member.account.id === workspace.accountId) {
    const error: any = new Error('Cannot remove the workspace owner.')
    error.status = StatusCodes.BAD_REQUEST
    error.code = 'OWNER_CANNOT_REMOVE_SELF'
    throw error
  }

  await CollabRepository.deleteMember(params.memberId, params.workspaceId)
}

// ─── Invitations ─────────────────────────────────────────────────────────────

export const sendInvitation = async (params: {
  workspaceId: string
  email: string
  role: WorkspaceRole
  invitedById: string
}) => {
  // Check for existing pending invite
  const existing = await CollabRepository.getPendingInvitationByEmail(
    params.workspaceId,
    params.email,
  )
  if (existing) {
    const error: any = new Error('A pending invitation already exists for this email.')
    error.status = StatusCodes.CONFLICT
    error.code = 'PENDING_INVITE_EXISTS'
    throw error
  }

  // Check if user is already a member
  const account = await db.accounts.findFirst({
    where: { email: params.email, isRemove: false },
    select: { id: true },
  })
  if (account) {
    const existingMember = await CollabRepository.getMemberByAccountId(
      params.workspaceId,
      account.id,
    )
    if (existingMember) {
      const error: any = new Error('This user is already a member of the workspace.')
      error.status = StatusCodes.CONFLICT
      error.code = 'ALREADY_MEMBER'
      throw error
    }
  }

  const token = crypto.randomBytes(32).toString('hex') // 64-char hex, 32 bytes entropy
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

  const invitation = await CollabRepository.createInvitation({
    workspaceId: params.workspaceId,
    email: params.email,
    role: params.role,
    token,
    invitedById: params.invitedById,
    expiresAt,
  })

  const workspace = await CollabRepository.getWorkspaceOwnerInfo(params.workspaceId)
  const inviteUrl = `${config.FRONTEND_URL}/invite/accept?token=${token}`

  // Fire-and-forget — email failure must not abort the invitation creation
  sendInvitationEmail({
    to: params.email,
    inviterName: invitation.invitedBy.displayName,
    workspaceName: workspace?.name ?? 'a workspace',
    inviteUrl,
    role: params.role,
    expiresAt,
  }).catch(() => {
    // Non-fatal — invite is still valid without email delivery
  })

  return invitation
}

export const acceptInvitation = async (params: { token: string; accountId: string }) => {
  const invitation = await CollabRepository.getInvitationByToken(params.token)

  if (!invitation) {
    const error: any = new Error('Invitation not found.')
    error.status = StatusCodes.NOT_FOUND
    throw error
  }

  if (invitation.status === 'accepted') {
    const error: any = new Error('Invitation has already been accepted.')
    error.status = StatusCodes.CONFLICT
    throw error
  }

  if (invitation.status === 'expired' || invitation.expiresAt < new Date()) {
    const error: any = new Error('Invitation has expired.')
    error.status = StatusCodes.GONE
    error.code = 'INVITE_EXPIRED'
    throw error
  }

  // Verify the accepting user's email matches the invitation
  const account = await db.accounts.findFirst({
    where: { id: params.accountId, isRemove: false },
    select: { id: true, email: true },
  })
  if (!account) {
    const error: any = new Error('Account not found.')
    error.status = StatusCodes.NOT_FOUND
    throw error
  }

  if (account.email.toLowerCase() !== invitation.email.toLowerCase()) {
    const error: any = new Error('This invitation was sent to a different email address.')
    error.status = StatusCodes.FORBIDDEN
    throw error
  }

  // Check not already a member
  const existing = await CollabRepository.getMemberByAccountId(
    invitation.workspaceId,
    params.accountId,
  )
  if (existing) {
    const error: any = new Error('You are already a member of this workspace.')
    error.status = StatusCodes.CONFLICT
    throw error
  }

  await CollabRepository.acceptInvitation(invitation.id)
  const member = await CollabRepository.createMember(
    invitation.workspaceId,
    params.accountId,
    invitation.role,
  )

  return { member, workspaceId: invitation.workspaceId }
}

export const getInvitationInfo = async (token: string) => {
  const invitation = await CollabRepository.getInvitationByToken(token)

  if (!invitation) {
    const error: any = new Error('Invitation not found.')
    error.status = StatusCodes.NOT_FOUND
    throw error
  }

  if (invitation.status === 'expired' || invitation.expiresAt < new Date()) {
    const error: any = new Error('Invitation has expired.')
    error.status = StatusCodes.GONE
    error.code = 'INVITE_EXPIRED'
    throw error
  }

  return invitation
}
