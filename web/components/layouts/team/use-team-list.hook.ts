import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import customServiceError from '@/utils/custom-service-error'
import useTeamListsStore, { type Team } from '@/stores/team-list.store'

const PAGE_SIZE = 20

export const useTeamHook = () => {
  const router = useRouter()
  const { setTeams, setTotal, appendTeams, activeTeam, setActiveTeam } = useTeamListsStore()
  const total = useTeamListsStore((state) => state.total)
  const teamsLength = useTeamListsStore((state) => state.teams?.length ?? 0)

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const pageRef = useRef(1)

  const hasMore = teamsLength < total

  const fetchTeams = useCallback(
    async (search = '') => {
      try {
        setLoading(true)
        setError('')
        pageRef.current = 1

        const result = await callWithAuth.get<{ data: Team[]; total: number }>(
          authApiPath.team.getTeams,
          { params: { page: 1, limit: PAGE_SIZE, ...(search ? { search } : {}) } },
        )

        if (result.status === 200) {
          if (result.data.total === 0 && !search) {
            router.push('/team/create')
          }

          if (!activeTeam) {
            setActiveTeam(result.data.data[0])
          }
          
          setTeams(result.data.data)
          setTotal(result.data.total)
        }
      } catch (err) {
        const e = customServiceError(err)
        setError(
          Array.isArray(e?.message)
            ? e.message.join(', ')
            : (e?.message ?? 'Failed to load teams'),
        )
      } finally {
        setLoading(false)
      }
    },
    [router, setTeams, setTotal],
  )

  const fetchMoreTeams = useCallback(
    async (search = '') => {
      if (loadingMore || !hasMore) return
      const nextPage = pageRef.current + 1

      try {
        setLoadingMore(true)

        const result = await callWithAuth.get<{ data: Team[]; total: number }>(
          authApiPath.team.getTeams,
          {
            params: {
              page: nextPage,
              limit: PAGE_SIZE,
              ...(search ? { search } : {}),
            },
          },
        )

        if (result.status === 200) {
          appendTeams(result.data.data)
          setTotal(result.data.total)
          pageRef.current = nextPage
        }
      } catch {
        // silently fail — list already shows what was loaded
      } finally {
        setLoadingMore(false)
      }
    },
    [loadingMore, hasMore, appendTeams, setTotal],
  )

  return { loading, loadingMore, hasMore, total, error, fetchTeams, fetchMoreTeams }
}
