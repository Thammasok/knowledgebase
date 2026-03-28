import * as PageRepository from './page.repository'
import { incrementBlockCount } from '../../libs/block-quota/block-quota.service'
import { createPageVersion } from './version/page-version.repository'

export const getPages = async (params: { workspaceId: string; accountId: string }) => {
  return await PageRepository.getPagesByWorkspaceId(params)
}

export const getPage = async (params: { id: string; workspaceId: string; accountId: string }) => {
  const page = await PageRepository.getPageById(params)
  if (!page) {
    const error: any = new Error('Page not found')
    error.status = 404
    throw error
  }
  return page
}

export const createPage = async (data: PageRepository.ICreatePage) => {
  return await PageRepository.createPage(data)
}

export const updatePage = async (data: PageRepository.IUpdatePage) => {
  return await PageRepository.updatePage(data)
}

export const updatePageContent = async (
  data: PageRepository.IUpdatePageContent & { tier: string },
) => {
  const currentBlockCount = await PageRepository.getPageCurrentBlockCount(data.id)
  const newBlockCount = data.blocks.length
  const delta = newBlockCount - currentBlockCount

  if (delta > 0) {
    await incrementBlockCount(data.workspaceId, delta, data.tier)
  }

  // Snapshot the current content before overwriting (for version history)
  const currentPage = await PageRepository.getPageById({
    id: data.id,
    workspaceId: data.workspaceId,
    accountId: data.accountId,
  })
  if (currentPage) {
    await createPageVersion(data.id, data.accountId, currentPage.content)
  }

  return await PageRepository.updatePageContent(data)
}

export const deletePage = async (data: { id: string; workspaceId: string; accountId: string }) => {
  return await PageRepository.deletePage(data)
}
