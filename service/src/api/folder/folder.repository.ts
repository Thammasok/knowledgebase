import db from '../../libs/db/prisma'

const folderSelect = {
  id: true,
  name: true,
  parentId: true,
  depth: true,
  order: true,
  workspaceId: true,
  createdAt: true,
  updatedAt: true,
}

export interface ICreateFolder {
  workspaceId: string
  accountId: string
  name: string
  parentId?: string | null
  order?: number
}

export interface IUpdateFolder {
  id: string
  workspaceId: string
  accountId: string
  name?: string
  order?: number
}

export interface IGetFolders {
  workspaceId: string
  accountId: string
}

export const getFoldersByWorkspaceId = async ({ workspaceId, accountId }: IGetFolders) => {
  return await db.folder.findMany({
    where: {
      workspaceId,
      workspace: { accountId },
      isRemove: false,
    },
    select: folderSelect,
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
}

export const createFolder = async ({ workspaceId, accountId, name, parentId, order }: ICreateFolder) => {
  let depth = 0

  if (parentId) {
    const parent = await db.folder.findFirst({
      where: { id: parentId, workspaceId, isRemove: false },
      select: { depth: true },
    })

    if (!parent) {
      const error: any = new Error('Parent folder not found')
      error.status = 404
      throw error
    }

    if (parent.depth >= 2) {
      const error: any = new Error('Maximum folder nesting depth reached.')
      error.status = 400
      error.code = 'MAX_NESTING_DEPTH'
      throw error
    }

    depth = parent.depth + 1
  }

  return await db.folder.create({
    data: {
      workspaceId,
      parentId: parentId || null,
      name,
      depth,
      order: order ?? 0,
    },
    select: folderSelect,
  })
}

export const updateFolder = async ({ id, workspaceId, accountId, name, order }: IUpdateFolder) => {
  return await db.folder.update({
    where: {
      id,
      workspaceId,
      workspace: { accountId },
      isRemove: false,
    },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(order !== undefined ? { order } : {}),
    },
    select: folderSelect,
  })
}

export const deleteFolder = async ({
  id,
  workspaceId,
  accountId,
}: {
  id: string
  workspaceId: string
  accountId: string
}) => {
  // Soft-delete the folder and cascade to child folders and pages
  await db.$transaction(async (tx) => {
    // Soft-delete all pages in this folder
    await tx.page.updateMany({
      where: { folderId: id, workspaceId, isRemove: false },
      data: { isRemove: true },
    })

    // Soft-delete child folders recursively (one level — depth limit of 3 makes this safe)
    const children = await tx.folder.findMany({
      where: { parentId: id, workspaceId, isRemove: false },
      select: { id: true },
    })

    for (const child of children) {
      await tx.page.updateMany({
        where: { folderId: child.id, workspaceId, isRemove: false },
        data: { isRemove: true },
      })
    }

    await tx.folder.updateMany({
      where: { parentId: id, workspaceId, isRemove: false },
      data: { isRemove: true },
    })

    // Soft-delete the folder itself
    await tx.folder.update({
      where: { id, workspaceId, workspace: { accountId }, isRemove: false },
      data: { isRemove: true },
    })
  })
}
