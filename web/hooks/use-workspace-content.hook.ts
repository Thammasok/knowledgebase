'use client'

import { useCallback, useState } from 'react'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import useWorkspaceContentStore, { type Folder, type Page } from '@/stores/workspace-content.store'
import customServiceError from '@/utils/custom-service-error'

export const useWorkspaceContent = () => {
  const {
    folders,
    pages,
    loadedWorkspaceId,
    setFolders,
    setPages,
    addFolder,
    updateFolder,
    removeFolder,
    addPage,
    updatePage,
    removePage,
    setLoadedWorkspaceId,
  } = useWorkspaceContentStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadContent = useCallback(async (workspaceId: string) => {
    if (loadedWorkspaceId === workspaceId) return
    try {
      setLoading(true)
      setError('')

      const [foldersRes, pagesRes] = await Promise.all([
        callWithAuth.get<Folder[]>(authApiPath.workspace.getFolders(workspaceId)),
        callWithAuth.get<Page[]>(authApiPath.workspace.getPages(workspaceId)),
      ])

      setFolders(foldersRes.data)
      setPages(pagesRes.data)
      setLoadedWorkspaceId(workspaceId)
    } catch (err) {
      const e = customServiceError(err)
      setError(String(e?.message ?? 'Failed to load workspace content'))
    } finally {
      setLoading(false)
    }
  }, [loadedWorkspaceId, setFolders, setPages, setLoadedWorkspaceId])

  const createFolder = useCallback(
    async (workspaceId: string, name: string, parentId?: string | null) => {
      const res = await callWithAuth.post<Folder>(
        authApiPath.workspace.createFolder(workspaceId),
        { name, parentId: parentId ?? null },
      )
      addFolder(res.data)
      return res.data
    },
    [addFolder],
  )

  const renameFolder = useCallback(
    async (workspaceId: string, folderId: string, name: string) => {
      const res = await callWithAuth.patch<Folder>(
        authApiPath.workspace.updateFolder(workspaceId, folderId),
        { name },
      )
      updateFolder(res.data)
      return res.data
    },
    [updateFolder],
  )

  const deleteFolder = useCallback(
    async (workspaceId: string, folderId: string) => {
      await callWithAuth.delete(authApiPath.workspace.deleteFolder(workspaceId, folderId))
      removeFolder(folderId)
    },
    [removeFolder],
  )

  const createPage = useCallback(
    async (
      workspaceId: string,
      opts: { title?: string; folderId?: string | null; parentPageId?: string | null },
    ) => {
      const res = await callWithAuth.post<Page>(
        authApiPath.workspace.createPage(workspaceId),
        opts,
      )
      addPage(res.data)
      return res.data
    },
    [addPage],
  )

  const renamePage = useCallback(
    async (workspaceId: string, pageId: string, title: string) => {
      const res = await callWithAuth.patch<Page>(
        authApiPath.workspace.updatePage(workspaceId, pageId),
        { title },
      )
      updatePage(res.data)
      return res.data
    },
    [updatePage],
  )

  const deletePage = useCallback(
    async (workspaceId: string, pageId: string) => {
      await callWithAuth.delete(authApiPath.workspace.deletePage(workspaceId, pageId))
      removePage(pageId)
    },
    [removePage],
  )

  return {
    folders,
    pages,
    loading,
    error,
    loadContent,
    createFolder,
    renameFolder,
    deleteFolder,
    createPage,
    renamePage,
    deletePage,
  }
}
