import z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApiPath } from '@/configs/service.config'
import callWithAuth from '@/services/auth.service'
import useTeamListsStore, { type Team } from '@/stores/team-list.store'
import customServiceError from '@/utils/custom-service-error'
import { type TeamForm } from './use-team-create.hook'

const teamSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Team name must be at least 3 characters' })
    .max(50, { message: 'Team name must be at most 50 characters' }),
  logo: z.string().optional(),
  color: z.string().optional(),
})

interface UseTeamEditHookProps {
  team: Team
  onClose: () => void
}

export const useTeamEditHook = ({ team, onClose }: UseTeamEditHookProps) => {
  const { updateTeam } = useTeamListsStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const teamForm = useForm<TeamForm>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team.name,
      logo: team.logo,
      color: team.color,
    },
  })

  const onSubmit = async (payload: TeamForm) => {
    try {
      setLoading(true)
      setError('')

      const result = await callWithAuth.patch<Team>(
        `${authApiPath.team.updateTeam}/${team.id}`,
        payload,
      )

      if (result.status === 200) {
        updateTeam(result.data)
        onClose()
      }
    } catch (err) {
      const e = customServiceError(err)
      setError(
        Array.isArray(e?.message)
          ? e.message.join(', ')
          : (e?.message ?? 'Failed to update team'),
      )
    } finally {
      setLoading(false)
    }
  }

  return { teamForm, loading, error, onSubmit }
}
