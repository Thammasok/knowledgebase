'use client'

import { useState, useEffect, useCallback } from 'react'
import { History, RotateCcw, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import { UpgradeBanner } from './upgrade-banner'

interface VersionAuthor {
  id: string
  displayName: string
}

interface PageVersion {
  id: string
  pageId: string
  createdAt: string
  account: VersionAuthor
}

interface VersionHistoryPanelProps {
  workspaceId: string
  pageId: string
  /** Called with the restored content blocks after a successful restore */
  onRestore: (blocks: unknown[]) => void
}

export function VersionHistoryPanel({ workspaceId, pageId, onRestore }: VersionHistoryPanelProps) {
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState<PageVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [planRequired, setPlanRequired] = useState(false)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const fetchVersions = useCallback(async () => {
    setLoading(true)
    setPlanRequired(false)
    try {
      const res = await callWithAuth.get(
        authApiPath.workspace.getPageVersions(workspaceId, pageId),
      )
      setVersions(Array.isArray(res.data) ? res.data : [])
    } catch (err: any) {
      if (err?.response?.data?.code === 'PLAN_REQUIRED') {
        setPlanRequired(true)
      } else {
        toast.error('Failed to load version history')
      }
    } finally {
      setLoading(false)
    }
  }, [workspaceId, pageId])

  useEffect(() => {
    if (open) {
      fetchVersions()
    }
  }, [open, fetchVersions])

  const handleRestore = async (versionId: string) => {
    setRestoringId(versionId)
    try {
      const res = await callWithAuth.post(
        authApiPath.workspace.restorePageVersion(workspaceId, pageId, versionId),
        {},
      )
      const restoredContent = Array.isArray(res.data?.content) ? res.data.content : []
      onRestore(restoredContent)
      setOpen(false)
      toast.success('Page restored to selected version')
    } catch {
      toast.error('Failed to restore version')
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <History className="h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="px-4 pt-4 pb-3 border-b">
          <SheetTitle>Version History</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : planRequired ? (
          <div className="p-4">
            <UpgradeBanner
              feature="Version History"
              requiredTier="personal"
              description="View and restore previous versions of your pages on the Personal plan and above."
            />
          </div>
        ) : versions.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No saved versions yet. Versions are created automatically when you save content.
          </div>
        ) : (
          <ScrollArea className="h-full">
            <ul className="divide-y">
              {versions.map((v) => (
                <li key={v.id} className="px-4 py-3 flex items-start justify-between gap-2 group">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{v.account.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(v.createdAt), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={restoringId === v.id}
                    onClick={() => handleRestore(v.id)}
                    title="Restore this version"
                  >
                    {restoringId === v.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}
