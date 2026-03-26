'use client'

import { AlertCircleIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Form } from '@/components/ui/form'
import { type Workspace } from '@/stores/workspace-list.store'
import { WorkspaceCreateForm } from './workspace-create-form'
import { useWorkspaceEditHook } from './use-workspace-edit.hook'

interface WorkspaceEditModalProps {
  workspace: Workspace | null
  onClose: () => void
}

function WorkspaceEditForm({ workspace, onClose }: { workspace: Workspace; onClose: () => void }) {
  const { workspaceForm, loading, error, onSubmit } = useWorkspaceEditHook({
    workspace,
    onClose,
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <Form {...workspaceForm}>
      <form onSubmit={workspaceForm.handleSubmit(onSubmit)}>
        <Dialog open onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit workspace</DialogTitle>
              <DialogDescription>
                Update the workspace name, icon, or color.
              </DialogDescription>
            </DialogHeader>

            <WorkspaceCreateForm form={workspaceForm} />

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={workspaceForm.handleSubmit(onSubmit)}
                disabled={!workspaceForm.watch('name')?.trim() || loading}
              >
                {loading && <Spinner />}
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}

export function WorkspaceEditModal({ workspace, onClose }: WorkspaceEditModalProps) {
  if (!workspace) return null
  return <WorkspaceEditForm key={workspace.id} workspace={workspace} onClose={onClose} />
}
