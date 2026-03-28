import * as PageVersionRepository from './page-version.repository'
import * as PageRepository from '../page.repository'

export const listVersions = async (params: {
  pageId: string
  workspaceId: string
  accountId: string
}) => {
  const page = await PageRepository.getPageById({
    id: params.pageId,
    workspaceId: params.workspaceId,
    accountId: params.accountId,
  })

  if (!page) {
    const error: any = new Error('Page not found')
    error.status = 404
    throw error
  }

  return await PageVersionRepository.getVersionsByPageId(params.pageId)
}

export const restoreVersion = async (params: {
  pageId: string
  versionId: string
  workspaceId: string
  accountId: string
}) => {
  const page = await PageRepository.getPageById({
    id: params.pageId,
    workspaceId: params.workspaceId,
    accountId: params.accountId,
  })

  if (!page) {
    const error: any = new Error('Page not found')
    error.status = 404
    throw error
  }

  const version = await PageVersionRepository.getVersionById(params.versionId, params.pageId)
  if (!version) {
    const error: any = new Error('Version not found')
    error.status = 404
    throw error
  }

  // Save current state as a new snapshot before overwriting
  await PageVersionRepository.createPageVersion(params.pageId, params.accountId, page.content)

  // Restore the page content from the selected version
  const restored = await PageRepository.updatePageContent({
    id: params.pageId,
    workspaceId: params.workspaceId,
    accountId: params.accountId,
    blocks: Array.isArray(version.content) ? (version.content as unknown[]) : [],
  })

  return restored
}
