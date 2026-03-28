import db from '../../../libs/db/prisma'

const versionListSelect = {
  id: true,
  pageId: true,
  createdAt: true,
  account: {
    select: { id: true, displayName: true },
  },
}

export const createPageVersion = async (pageId: string, accountId: string, content: unknown) => {
  return await db.pageVersion.create({
    data: {
      pageId,
      accountId,
      content: content as any,
    },
    select: versionListSelect,
  })
}

export const getVersionsByPageId = async (pageId: string) => {
  return await db.pageVersion.findMany({
    where: { pageId },
    select: versionListSelect,
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export const getVersionById = async (id: string, pageId: string) => {
  return await db.pageVersion.findFirst({
    where: { id, pageId },
    select: {
      id: true,
      pageId: true,
      content: true,
      createdAt: true,
      account: {
        select: { id: true, displayName: true },
      },
    },
  })
}
