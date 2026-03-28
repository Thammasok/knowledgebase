'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, UserMinus, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import { UpgradeBanner } from '@/components/content/upgrade-banner'
import useWorkspaceListsStore from '@/stores/workspace-list.store'

interface Member {
  id: string
  role: 'owner' | 'member' | 'viewer'
  createdAt: string | null
  account: { id: string; displayName: string; email: string; image: string | null }
  isOwner?: boolean
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  member: 'Member',
  viewer: 'Viewer',
}

export function MembersSection() {
  const activeWorkspace = useWorkspaceListsStore((s) => s.activeWorkspace)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [planRequired, setPlanRequired] = useState(false)

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'member' | 'viewer'>('member')
  const [inviting, setInviting] = useState(false)

  const workspaceId = activeWorkspace?.id

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return
    setLoading(true)
    setPlanRequired(false)
    try {
      const res = await callWithAuth.get(authApiPath.workspace.getMembers(workspaceId))
      setMembers(Array.isArray(res.data) ? res.data : [])
    } catch (err: any) {
      if (err?.response?.data?.code === 'PLAN_REQUIRED') {
        setPlanRequired(true)
      } else {
        toast.error('Failed to load members')
      }
    } finally {
      setLoading(false)
    }
  }, [workspaceId])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspaceId || !inviteEmail) return
    setInviting(true)
    try {
      await callWithAuth.post(authApiPath.workspace.inviteMember(workspaceId), {
        email: inviteEmail,
        role: inviteRole,
      })
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
    } catch (err: any) {
      const code = err?.response?.data?.code
      if (code === 'PENDING_INVITE_EXISTS') {
        toast.error('A pending invitation already exists for this email.')
      } else if (code === 'ALREADY_MEMBER') {
        toast.error('This user is already a member.')
      } else if (code === 'PLAN_REQUIRED') {
        toast.error('Upgrade to Startup to invite members.')
      } else {
        toast.error('Failed to send invitation')
      }
    } finally {
      setInviting(false)
    }
  }

  const handleRoleChange = async (memberId: string, role: 'member' | 'viewer') => {
    if (!workspaceId) return
    try {
      const res = await callWithAuth.patch(
        authApiPath.workspace.updateMemberRole(workspaceId, memberId),
        { role },
      )
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: res.data.role } : m)))
      toast.success('Role updated')
    } catch {
      toast.error('Failed to update role')
    }
  }

  const handleRemove = async (memberId: string) => {
    if (!workspaceId) return
    try {
      await callWithAuth.delete(authApiPath.workspace.removeMember(workspaceId, memberId))
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
      toast.success('Member removed')
    } catch (err: any) {
      const code = err?.response?.data?.code
      if (code === 'OWNER_CANNOT_REMOVE_SELF') {
        toast.error('You cannot remove the workspace owner.')
      } else {
        toast.error('Failed to remove member')
      }
    }
  }

  if (!workspaceId) {
    return (
      <p className="text-sm text-muted-foreground">
        Select a workspace from the sidebar to manage its members.
      </p>
    )
  }

  if (planRequired) {
    return (
      <UpgradeBanner
        feature="Team Members"
        requiredTier="startup"
        description="Invite team members and manage roles on the Startup plan."
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Invite form */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Invite a member</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Send an invitation to a team member's email address.
          </p>
        </div>
        <form onSubmit={handleInvite} className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="invite-email" className="sr-only">
              Email
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="gap-1 shrink-0">
                {ROLE_LABELS[inviteRole]}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setInviteRole('member')}>Member</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setInviteRole('viewer')}>Viewer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit" disabled={inviting || !inviteEmail}>
            {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Invite'}
          </Button>
        </form>
      </div>

      <Separator />

      {/* Members list */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">
          Members
          {members.length > 0 && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {members.length}
            </span>
          )}
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members yet. Invite someone above.</p>
        ) : (
          <div className="rounded-xl border divide-y">
            {members.map((member) => (
              <div
                key={member.account.id}
                className="flex items-center justify-between px-4 py-3 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold select-none">
                    {member.account.displayName[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{member.account.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.account.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {member.isOwner ? (
                    <Badge variant="secondary" className="text-xs">
                      Owner
                    </Badge>
                  ) : (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                            {ROLE_LABELS[member.role]}
                            <ChevronDown className="h-3 w-3 opacity-60" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(member.id, 'member')}
                            disabled={member.role === 'member'}
                          >
                            Member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(member.id, 'viewer')}
                            disabled={member.role === 'viewer'}
                          >
                            Viewer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {member.account.displayName} will lose access to this workspace.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemove(member.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
