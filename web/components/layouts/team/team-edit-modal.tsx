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
import { type Team } from '@/stores/team-list.store'
import { TeamCreateForm } from './team-create-form'
import { useTeamEditHook } from './use-team-edit.hook'

interface TeamEditModalProps {
  team: Team | null
  onClose: () => void
}

function TeamEditForm({ team, onClose }: { team: Team; onClose: () => void }) {
  const { teamForm, loading, error, onSubmit } = useTeamEditHook({
    team,
    onClose,
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  return (
    <Form {...teamForm}>
      <form onSubmit={teamForm.handleSubmit(onSubmit)}>
        <Dialog open onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit team</DialogTitle>
              <DialogDescription>
                Update the team name, icon, or color.
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
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={teamForm.handleSubmit(onSubmit)}
                disabled={!teamForm.watch('name')?.trim() || loading}
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

export function TeamEditModal({ team, onClose }: TeamEditModalProps) {
  if (!team) return null
  return <TeamEditForm key={team.id} team={team} onClose={onClose} />
}
