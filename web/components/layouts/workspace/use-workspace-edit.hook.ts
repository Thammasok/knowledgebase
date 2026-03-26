import z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApiPath } from '@/configs/service.config'
import callWithAuth from '@/services/auth.service'
import useWorkspaceListsStore, { type Workspace } from '@/stores/workspace-list.store'
import customServiceError from '@/utils/custom-service-error'
import { type WorkspaceForm } from './use-workspace-create.hook'

const workspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Workspace name must be at least 3 characters' })
    .max(50, { message: 'Workspace name must be at most 50 characters' }),
  logo: z.string().optional(),
  color: z.string().optional(),
})

interface UseWorkspaceEditHookProps {
  workspace: Workspace
  onClose: () => void
}

export const useWorkspaceEditHook = ({ workspace, onClose }: UseWorkspaceEditHookProps) => {
  const { updateWorkspace } = useWorkspaceListsStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const workspaceForm = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace.name,
      logo: workspace.logo,
      color: workspace.color,
    },
  })

  const onSubmit = async (payload: WorkspaceForm) => {
    try {
      setLoading(true)
      setError('')

      const result = await callWithAuth.patch<Workspace>(
        `${authApiPath.workspace.updateWorkspace}/${workspace.id}`,
        payload,
      )

      if (result.status === 200) {
        updateWorkspace(result.data)
        onClose()
      }
    } catch (err) {
      const e = customServiceError(err)
      setError(
        Array.isArray(e?.message)
          ? e.message.join(', ')
          : (e?.message ?? 'Failed to update workspace'),
      )
    } finally {
      setLoading(false)
    }
  }

  return { workspaceForm, loading, error, onSubmit }
}
