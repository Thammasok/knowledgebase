import db from '../../libs/db/prisma'

export interface ICreateWorkspace {
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export interface IGetWorkspaces {
  accountId: string
  search?: string
  page: number
  limit: number
}

export const createWorkspace = async ({
  accountId,
  name,
  logo,
  color,
}: ICreateWorkspace) => {
  return await db.workspace.create({
    data: {
      accountId,
      name,
      logo: logo || null,
      color: color || '#18181b',
      isRemove: false,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      color: true,
      createdAt: true,
    },
  })
}

export interface IUpdateWorkspace {
  id: string
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export const updateWorkspace = async ({ id, accountId, name, logo, color }: IUpdateWorkspace) => {
  return await db.workspace.update({
    where: { id, accountId, isRemove: false },
    data: {
      name,
      logo: logo ?? null,
      ...(color ? { color } : {}),
    },
    select: {
      id: true,
      name: true,
      logo: true,
      color: true,
      createdAt: true,
    },
  })
}

export const getWorkspacesByAccountId = async ({
  accountId,
  search,
  page,
  limit,
}: IGetWorkspaces) => {
  const where = {
    accountId,
    isRemove: false,
    ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
  }

  const [data, total] = await db.$transaction([
    db.workspace.findMany({
      where,
      select: {
        id: true,
        name: true,
        logo: true,
        color: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.workspace.count({ where }),
  ])

  return { data, total }
}
