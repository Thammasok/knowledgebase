import db from '../../libs/db/prisma'

export interface ICreateTeam {
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export interface IGetTeams {
  accountId: string
  search?: string
  page: number
  limit: number
}

export const createTeam = async ({
  accountId,
  name,
  logo,
  color,
}: ICreateTeam) => {
  return await db.team.create({
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

export interface IUpdateTeam {
  id: string
  accountId: string
  name: string
  logo?: string | null
  color?: string
}

export const updateTeam = async ({ id, accountId, name, logo, color }: IUpdateTeam) => {
  return await db.team.update({
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

export const getTeamsByAccountId = async ({
  accountId,
  search,
  page,
  limit,
}: IGetTeams) => {
  const where = {
    accountId,
    isRemove: false,
    ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
  }

  const [data, total] = await db.$transaction([
    db.team.findMany({
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
    db.team.count({ where }),
  ])

  return { data, total }
}
