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
import { useTeamCreateHook } from './use-team-create.hook'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TeamCreateForm } from './team-create-form'

// ─── Component ────────────────────────────────────────────────────────────────

interface TeamCreateModalProps {
  open: boolean
  onClose: () => void
}

const TeamCreateModal = ({ open, onClose }: TeamCreateModalProps) => {
  const { teamForm, loading, error, onSubmit } = useTeamCreateHook({ onClose })

  const handleOpenChange = (open: boolean) => {
    if (!open) teamForm.reset()
    onClose()
  }

  return (
    <Form {...teamForm}>
      <form
        onSubmit={teamForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create new team</DialogTitle>
              <DialogDescription>
                Choose an icon, color, and give your team a name.
              </DialogDescription>
            </DialogHeader>

            <TeamCreateForm form={teamForm} />

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
                onClick={teamForm.handleSubmit(onSubmit)}
                disabled={!teamForm.watch('name').trim() || loading}
              >
                {loading && <Spinner />}
                Create team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}

export default TeamCreateModal
