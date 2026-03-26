import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import customServiceError from '@/utils/custom-service-error'
import useWorkspaceListsStore, { type Workspace } from '@/stores/workspace-list.store'

const PAGE_SIZE = 20

export const useWorkspaceHook = () => {
  const router = useRouter()
  const { setWorkspaces, setTotal, appendWorkspaces, activeWorkspace, setActiveWorkspace } = useWorkspaceListsStore()
  const total = useWorkspaceListsStore((state) => state.total)
  const workspacesLength = useWorkspaceListsStore((state) => state.workspaces?.length ?? 0)

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const pageRef = useRef(1)

  const hasMore = workspacesLength < total

  const fetchWorkspaces = useCallback(
    async (search = '') => {
      try {
        setLoading(true)
        setError('')
        pageRef.current = 1

        const result = await callWithAuth.get<{ data: Workspace[]; total: number }>(
          authApiPath.workspace.getWorkspaces,
          { params: { page: 1, limit: PAGE_SIZE, ...(search ? { search } : {}) } },
        )

        if (result.status === 200) {
          if (result.data.total === 0 && !search) {
            router.push('/workspace/create')
          }

          if (!activeWorkspace) {
            setActiveWorkspace(result.data.data[0])
          }

          setWorkspaces(result.data.data)
          setTotal(result.data.total)
        }
      } catch (err) {
        const e = customServiceError(err)
        setError(
          Array.isArray(e?.message)
            ? e.message.join(', ')
            : (e?.message ?? 'Failed to load workspaces'),
        )
      } finally {
        setLoading(false)
      }
    },
    [router, setWorkspaces, setTotal],
  )

  const fetchMoreWorkspaces = useCallback(
    async (search = '') => {
      if (loadingMore || !hasMore) return
      const nextPage = pageRef.current + 1

      try {
        setLoadingMore(true)

        const result = await callWithAuth.get<{ data: Workspace[]; total: number }>(
          authApiPath.workspace.getWorkspaces,
          {
            params: {
              page: nextPage,
              limit: PAGE_SIZE,
              ...(search ? { search } : {}),
            },
          },
        )

        if (result.status === 200) {
          appendWorkspaces(result.data.data)
          setTotal(result.data.total)
          pageRef.current = nextPage
        }
      } catch {
        // silently fail — list already shows what was loaded
      } finally {
        setLoadingMore(false)
      }
    },
    [loadingMore, hasMore, appendWorkspaces, setTotal],
  )

  return { loading, loadingMore, hasMore, total, error, fetchWorkspaces, fetchMoreWorkspaces }
}
