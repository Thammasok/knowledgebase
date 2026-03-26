import { useCallback, useEffect, useRef, useState } from 'react'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import customServiceError from '@/utils/custom-service-error'
import { type Workspace } from '@/stores/workspace-list.store'

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number]

export const useWorkspaceTableHook = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState<PageSizeOption>(10)
  const [search, setSearchState] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const fetch = useCallback(async (p: number, s: string, limit: number) => {
    try {
      setLoading(true)
      setError('')

      const result = await callWithAuth.get<{ data: Workspace[]; total: number }>(
        authApiPath.workspace.getWorkspaces,
        { params: { page: p, limit, ...(s ? { search: s } : {}) } },
      )

      if (result.status === 200) {
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
  }, [])

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setSearch = useCallback(
    (s: string) => {
      setSearchState(s)
      setPage(1)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(
        () => fetch(1, s, pageSize),
        400,
      )
    },
    [fetch, pageSize],
  )

  const goToPage = useCallback(
    (p: number) => {
      setPage(p)
      fetch(p, search, pageSize)
    },
    [fetch, search, pageSize],
  )

  const setPageSize = useCallback(
    (limit: PageSizeOption) => {
      setPageSizeState(limit)
      setPage(1)
      fetch(1, search, limit)
    },
    [fetch, search],
  )

  const refresh = useCallback(() => {
    fetch(page, search, pageSize)
  }, [fetch, page, search, pageSize])

  useEffect(() => {
    fetch(1, '', 10)
  }, [fetch])

  return {
    workspaces,
    total,
    page,
    totalPages,
    pageSize,
    search,
    loading,
    error,
    setSearch,
    setPageSize,
    goToPage,
    refresh,
  }
}
