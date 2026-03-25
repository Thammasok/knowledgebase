import z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { type IconName } from 'lucide-react/dynamic'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApiPath } from '@/configs/service.config'
import callWithAuth from '@/services/auth.service'
import useTeamListsStore, { type Team } from '@/stores/team-list.store'
import customServiceError from '@/utils/custom-service-error'

interface UseTeamCreateHookProps {
  onClose: () => void
}

export interface ICreateTeamPayload {
  name: string
  logo?: IconName | ''
  color?: string
}


const teamSchema = z.object({
    name: z
      .string()
      .min(3, {
        message: 'Display name must be at least 3 characters',
      })
      .max(50, {
        message: 'Display name must be at most 50 characters',
      }),
    logo: z.string().optional(),
    color: z.string().optional(),
})

export type TeamForm = z.infer<typeof teamSchema>


export const useTeamCreateHook = ({ onClose }: UseTeamCreateHookProps) => {
  const { addTeam } = useTeamListsStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

    const teamForm = useForm<TeamForm>({
      resolver: zodResolver(teamSchema),
      defaultValues: {
        name: '',
        logo: '',
        color: '#18181b',
      },
    })

  const onSubmit = async (payload: TeamForm) => {
    try {
      setLoading(true)
      setError('')

     const result = await callWithAuth.post<Team>(
          authApiPath.team.createTeam,
          payload,
        )

      if (result.status === 201) {
        addTeam(result.data)

        setError('')
        onClose()
      }
    } catch (error) {
      const e = customServiceError(error)
        const errorMessage = Array.isArray(e?.message) ? e.message.join(', ') : (e?.message ?? 'Failed to load teams')
        setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { teamForm, loading, error, onSubmit }
}
