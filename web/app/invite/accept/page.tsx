'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import { getSession } from '@/lib/session'

interface InvitationInfo {
  id: string
  email: string
  role: string
  status: string
  workspace: { id: string; name: string; color: string }
}

const ROLE_LABELS: Record<string, string> = { member: 'Member', viewer: 'Viewer' }

function InviteAcceptContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [invitation, setInvitation] = useState<InvitationInfo | null>(null)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkAuth = useCallback(async () => {
    const session = await getSession()
    setIsLoggedIn(!!session?.token?.accessToken)
  }, [])

  const fetchInvitation = useCallback(async () => {
    if (!token) {
      setError('Missing invitation token.')
      setLoadingInfo(false)
      return
    }
    try {
      const res = await callWithAuth.get(authApiPath.workspace.getInvitationInfo(token))
      setInvitation(res.data)
    } catch (err: any) {
      const code = err?.response?.data?.code
      if (code === 'INVITE_EXPIRED') {
        setError('This invitation has expired.')
      } else if (err?.response?.status === 404) {
        setError('Invitation not found.')
      } else if (err?.response?.status === 401) {
        // Not authenticated — just note it, don't set error
      } else {
        setError('Failed to load invitation details.')
      }
    } finally {
      setLoadingInfo(false)
    }
  }, [token])

  useEffect(() => {
    checkAuth()
    fetchInvitation()
  }, [checkAuth, fetchInvitation])

  const handleAccept = async () => {
    if (!token) return
    setAccepting(true)
    try {
      const res = await callWithAuth.post(authApiPath.workspace.acceptInvitation, { token })
      setAccepted(true)
      toast.success('Invitation accepted!')
      setTimeout(() => {
        router.push(`/dashboard?ws=${res.data?.workspaceId ?? ''}`)
      }, 1500)
    } catch (err: any) {
      const code = err?.response?.data?.code
      if (code === 'INVITE_EXPIRED') {
        setError('This invitation has expired.')
      } else {
        toast.error(err?.response?.data?.message ?? 'Failed to accept invitation')
      }
    } finally {
      setAccepting(false)
    }
  }

  const handleLogin = () => {
    const callbackUrl = encodeURIComponent(`/invite/accept?token=${token}`)
    router.push(`/auth/login?callbackUrl=${callbackUrl}`)
  }

  if (loadingInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm space-y-6">
        {accepted ? (
          <div className="text-center space-y-3">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h1 className="text-xl font-semibold">You're in!</h1>
            <p className="text-sm text-muted-foreground">Redirecting to your workspace…</p>
          </div>
        ) : error ? (
          <div className="text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-xl font-semibold">Invalid invitation</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => router.push('/')}>
              Go home
            </Button>
          </div>
        ) : invitation ? (
          <>
            <div className="text-center space-y-2">
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: invitation.workspace.color ?? '#18181b' }}
              >
                <Users className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-xl font-semibold">
                Join {invitation.workspace.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                You've been invited as a{' '}
                <span className="font-medium">{ROLE_LABELS[invitation.role] ?? invitation.role}</span>.
              </p>
            </div>

            {!isLoggedIn ? (
              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                  Sign in to accept this invitation.
                </p>
                <Button className="w-full" onClick={handleLogin}>
                  Sign in to accept
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const callbackUrl = encodeURIComponent(`/invite/accept?token=${token}`)
                    router.push(`/auth/signup?callbackUrl=${callbackUrl}`)
                  }}
                >
                  Create an account
                </Button>
              </div>
            ) : (
              <Button className="w-full" disabled={accepting} onClick={handleAccept}>
                {accepting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Accept invitation
              </Button>
            )}
          </>
        ) : (
          <div className="text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h1 className="text-xl font-semibold">Invitation not found</h1>
            <p className="text-sm text-muted-foreground">
              This invitation may have expired or already been used.
            </p>
            <Button variant="outline" onClick={() => router.push('/')}>
              Go home
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  )
}
