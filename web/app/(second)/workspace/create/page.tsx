'use client'

import { useRouter } from 'next/navigation'
import { AlertCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useWorkspaceCreateHook } from '@/components/layouts/workspace/use-workspace-create.hook'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { WorkspaceCreateForm } from '@/components/layouts/workspace/workspace-create-form'

// ─── Page ─────────────────────────────────────────────────────────────────────

const WorkspaceCreatePage = () => {
  const router = useRouter()
  const { workspaceForm, loading, error, onSubmit } = useWorkspaceCreateHook({
    onClose: () => router.push('/dashboard'),
  })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create a new workspace
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose an icon, color, and give your workspace a name.
          </p>
        </div>

        {/* Form */}
        <Form {...workspaceForm}>
          <form
            onSubmit={workspaceForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <WorkspaceCreateForm form={workspaceForm} />

            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={!workspaceForm.watch('name').trim() || loading}
              >
                {loading && <Spinner />}
                Create workspace
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default WorkspaceCreatePage
