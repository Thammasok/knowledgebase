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
import { useWorkspaceCreateHook } from './use-workspace-create.hook'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WorkspaceCreateForm } from './workspace-create-form'

// ─── Component ────────────────────────────────────────────────────────────────

interface WorkspaceCreateModalProps {
  open: boolean
  onClose: () => void
}

const WorkspaceCreateModal = ({ open, onClose }: WorkspaceCreateModalProps) => {
  const { workspaceForm, loading, error, onSubmit } = useWorkspaceCreateHook({ onClose })

  const handleOpenChange = (open: boolean) => {
    if (!open) workspaceForm.reset()
    onClose()
  }

  return (
    <Form {...workspaceForm}>
      <form
        onSubmit={workspaceForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create new workspace</DialogTitle>
              <DialogDescription>
                Choose an icon, color, and give your workspace a name.
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
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={workspaceForm.handleSubmit(onSubmit)}
                disabled={!workspaceForm.watch('name').trim() || loading}
              >
                {loading && <Spinner />}
                Create workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}

export default WorkspaceCreateModal
