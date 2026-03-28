import db from '../../../libs/db/prisma'
import { WorkspaceRole } from '../../../../generated/prisma/client'

// ─── Members ──────────────────────────────────────────────────────────────────

const memberSelect = {
  id: true,
  role: true,
  createdAt: true,
  account: {
    select: { id: true, displayName: true, email: true, image: true },
  },
}

export const getMembersByWorkspaceId = async (workspaceId: string) => {
  return await db.workspaceMember.findMany({
    where: { workspaceId },
    select: memberSelect,
    orderBy: { createdAt: 'asc' },
  })
}

export const getMemberById = async (id: string, workspaceId: string) => {
  return await db.workspaceMember.findFirst({
    where: { id, workspaceId },
    select: memberSelect,
  })
}

export const getMemberByAccountId = async (workspaceId: string, accountId: string) => {
  return await db.workspaceMember.findUnique({
    where: { workspaceId_accountId: { workspaceId, accountId } },
    select: { id: true, role: true },
  })
}

export const createMember = async (
  workspaceId: string,
  accountId: string,
  role: WorkspaceRole,
) => {
  return await db.workspaceMember.create({
    data: { workspaceId, accountId, role },
    select: memberSelect,
  })
}

export const updateMemberRole = async (id: string, workspaceId: string, role: WorkspaceRole) => {
  return await db.workspaceMember.update({
    where: { id, workspaceId },
    data: { role },
    select: memberSelect,
  })
}

export const deleteMember = async (id: string, workspaceId: string) => {
  return await db.workspaceMember.delete({
    where: { id, workspaceId },
  })
}

// ─── Invitations ─────────────────────────────────────────────────────────────

const invitationSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  expiresAt: true,
  createdAt: true,
  invitedBy: {
    select: { id: true, displayName: true },
  },
}

export const getPendingInvitationByEmail = async (workspaceId: string, email: string) => {
  return await db.workspaceInvitation.findFirst({
    where: { workspaceId, email, status: 'pending' },
    select: { id: true },
  })
}

export const getInvitationByToken = async (token: string) => {
  return await db.workspaceInvitation.findUnique({
    where: { token },
    select: {
      id: true,
      workspaceId: true,
      email: true,
      role: true,
      status: true,
      expiresAt: true,
      workspace: {
        select: { id: true, name: true, color: true, logo: true },
      },
    },
  })
}

export const createInvitation = async (params: {
  workspaceId: string
  email: string
  role: WorkspaceRole
  token: string
  invitedById: string
  expiresAt: Date
}) => {
  return await db.workspaceInvitation.create({
    data: params,
    select: invitationSelect,
  })
}

export const acceptInvitation = async (id: string) => {
  return await db.workspaceInvitation.update({
    where: { id },
    data: { status: 'accepted' },
    select: { id: true, workspaceId: true, email: true, role: true },
  })
}

export const getWorkspaceOwnerInfo = async (workspaceId: string) => {
  return await db.workspace.findUnique({
    where: { id: workspaceId, isRemove: false },
    select: {
      id: true,
      name: true,
      accountId: true,
      account: { select: { id: true } },
    },
  })
}
