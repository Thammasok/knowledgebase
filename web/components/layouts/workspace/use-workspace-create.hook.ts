import z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { type IconName } from 'lucide-react/dynamic'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApiPath } from '@/configs/service.config'
import callWithAuth from '@/services/auth.service'
import useWorkspaceListsStore, { type Workspace } from '@/stores/workspace-list.store'
import customServiceError from '@/utils/custom-service-error'

interface UseWorkspaceCreateHookProps {
  onClose: () => void
}

export interface ICreateWorkspacePayload {
  name: string
  logo?: IconName | ''
  color?: string
}


const workspaceSchema = z.object({
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

export type WorkspaceForm = z.infer<typeof workspaceSchema>


export const useWorkspaceCreateHook = ({ onClose }: UseWorkspaceCreateHookProps) => {
  const { addWorkspace } = useWorkspaceListsStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

    const workspaceForm = useForm<WorkspaceForm>({
      resolver: zodResolver(workspaceSchema),
      defaultValues: {
        name: '',
        logo: '',
        color: '#18181b',
      },
    })

  const onSubmit = async (payload: WorkspaceForm) => {
    try {
      setLoading(true)
      setError('')

     const result = await callWithAuth.post<Workspace>(
          authApiPath.workspace.createWorkspace,
          payload,
        )

      if (result.status === 201) {
        addWorkspace(result.data)

        setError('')
        onClose()
      }
    } catch (error) {
      const e = customServiceError(error)
        const errorMessage = Array.isArray(e?.message) ? e.message.join(', ') : (e?.message ?? 'Failed to load workspaces')
        setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { workspaceForm, loading, error, onSubmit }
}
