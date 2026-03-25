import { Details } from 'express-useragent'
import { IPLocation } from '../../utils/ip-address'
import { IDeviceInfo } from '../../utils/user-again-detect'
import db from '../../libs/db/prisma'

export interface CreateAuthSessionRepository {
  accountId: string
  deviceId: string | null
  ipAddress: string | null
  userAgent: IDeviceInfo
  ipInfo: IPLocation
}

export const createAuthSession = async ({
  accountId,
  deviceId,
  ipAddress,
  ipInfo,
  userAgent,
}: CreateAuthSessionRepository) => {
  return await db.authSession.create({
    data: {
      accountId,
      deviceId,
      isActive: true,
      ip: ipAddress,
      userAgent: JSON.stringify(userAgent) || '',
      ipInfo: JSON.stringify(ipInfo),
    },
  })
}

export interface UpdateAuthSessionRepository {
  id: string
  ipAddress: string | null
  userAgent: Details | undefined
  ipInfo: IPLocation
}

export const updateAuthSession = async ({
  id,
  ipAddress,
  userAgent,
  ipInfo,
}: UpdateAuthSessionRepository) => {
  return await db.authSession.update({
    where: {
      id,
    },
    data: {
      ip: ipAddress,
      userAgent: JSON.stringify(userAgent) || '',
      ipInfo: JSON.stringify(ipInfo),
    },
  })
}

export const deactivateAuthSession = async (id: string) => {
  return await db.authSession.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  })
}

export const deactivateAuthSessionByAccountIdAndDeviceId = async ({
  accountId,
  deviceId,
}: {
  accountId: string
  deviceId: string
}) => {
  return await db.authSession.updateMany({
    where: {
      accountId,
      deviceId,
    },
    data: {
      isActive: false,
    },
  })
}

export const deactivateAuthSessionByAccountIdAndSessionId = async ({
  accountId,
  sessionId,
  deviceId,
}: {
  accountId: string
  sessionId: string
  deviceId: string
}) => {
  return await db.authSession.updateMany({
    where: {
      id: sessionId,
      accountId,
      deviceId: {
        not: deviceId,
      },
    },
    data: {
      isActive: false,
    },
  })
}

export const getAuthSessionById = async (id: string) => {
  return await db.authSession.findUnique({
    where: {
      id,
    },
  })
}

export const getAuthSessionsAllByAccountIdAndDeviceId = async ({
  accountId,
  deviceId,
}: {
  accountId: string
  deviceId: string
}) => {
  return await db.authSession.findMany({
    where: {
      accountId,
      deviceId,
    },
  })
}

export interface GetAuthSessionsByAccountIdRepository {
  accountId: string
  page: number
  limit: number
}

export const getAuthSessionsAllByAccountId = async ({
  accountId,
  page,
  limit,
}: GetAuthSessionsByAccountIdRepository) => {
  return await db.authSession.findMany({
    where: {
      accountId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
  })
}

export const getAuthSessionsActiveByAccountId = async (accountId: string) => {
  return await db.authSession.findMany({
    where: {
      accountId,
      isActive: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}

export const getAuthSessionsActiveByAccountIdAndDeviceId = async ({
  accountId,
  deviceId,
}: {
  accountId: string
  deviceId: string
}) => {
  return await db.authSession.findMany({
    where: {
      accountId,
      deviceId,
      isActive: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
}
