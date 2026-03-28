import db from '../../libs/db/prisma'

const pageListSelect = {
  id: true,
  title: true,
  folderId: true,
  parentPageId: true,
  depth: true,
  order: true,
  workspaceId: true,
  createdAt: true,
  updatedAt: true,
}

const pageDetailSelect = {
  ...pageListSelect,
  content: true,
}

export interface ICreatePage {
  workspaceId: string
  accountId: string
  title?: string
  folderId?: string | null
  parentPageId?: string | null
  order?: number
}

export interface IUpdatePage {
  id: string
  workspaceId: string
  accountId: string
  title?: string
  order?: number
}

export interface IUpdatePageContent {
  id: string
  workspaceId: string
  accountId: string
  blocks: unknown[]
}

export const getPagesByWorkspaceId = async ({
  workspaceId,
  accountId,
}: {
  workspaceId: string
  accountId: string
}) => {
  return await db.page.findMany({
    where: {
      workspaceId,
      workspace: { accountId },
      isRemove: false,
    },
    select: pageListSelect,
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
}

export const getPageById = async ({
  id,
  workspaceId,
  accountId,
}: {
  id: string
  workspaceId: string
  accountId: string
}) => {
  return await db.page.findFirst({
    where: {
      id,
      workspaceId,
      workspace: { accountId },
      isRemove: false,
    },
    select: pageDetailSelect,
  })
}

export const createPage = async ({
  workspaceId,
  accountId,
  title,
  folderId,
  parentPageId,
  order,
}: ICreatePage) => {
  let depth = 0

  if (parentPageId) {
    const parent = await db.page.findFirst({
      where: { id: parentPageId, workspaceId, isRemove: false },
      select: { depth: true },
    })

    if (!parent) {
      const error: any = new Error('Parent page not found')
      error.status = 404
      throw error
    }

    if (parent.depth >= 4) {
      const error: any = new Error('Maximum page nesting depth reached.')
      error.status = 400
      error.code = 'MAX_NESTING_DEPTH'
      throw error
    }

    depth = parent.depth + 1
  }

  return await db.page.create({
    data: {
      workspaceId,
      folderId: folderId || null,
      parentPageId: parentPageId || null,
      title: title || 'Untitled',
      depth,
      order: order ?? 0,
      content: [],
    },
    select: pageListSelect,
  })
}

export const updatePage = async ({ id, workspaceId, accountId, title, order }: IUpdatePage) => {
  return await db.page.update({
    where: {
      id,
      workspaceId,
      workspace: { accountId },
      isRemove: false,
    },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(order !== undefined ? { order } : {}),
    },
    select: pageListSelect,
  })
}

export const updatePageContent = async ({ id, workspaceId, accountId, blocks }: IUpdatePageContent) => {
  return await db.page.update({
    where: {
      id,
      workspaceId,
      workspace: { accountId },
      isRemove: false,
    },
    data: { content: blocks as any },
    select: pageDetailSelect,
  })
}

export const getPageCurrentBlockCount = async (id: string): Promise<number> => {
  const page = await db.page.findUnique({
    where: { id },
    select: { content: true },
  })
  if (!page) return 0
  return Array.isArray(page.content) ? (page.content as unknown[]).length : 0
}

export const deletePage = async ({
  id,
  workspaceId,
  accountId,
}: {
  id: string
  workspaceId: string
  accountId: string
}) => {
  await db.$transaction(async (tx) => {
    // Soft-delete child pages recursively (up to 5 levels, so we iterate)
    const toDelete = [id]
    const processed = new Set<string>()

    while (toDelete.length > 0) {
      const current = toDelete.pop()!
      if (processed.has(current)) continue
      processed.add(current)

      const children = await tx.page.findMany({
        where: { parentPageId: current, workspaceId, isRemove: false },
        select: { id: true },
      })

      for (const child of children) {
        toDelete.push(child.id)
      }

      await tx.page.update({
        where: { id: current },
        data: { isRemove: true },
      })
    }
  })
}
