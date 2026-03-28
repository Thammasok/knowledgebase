'use client'

import { useState, useCallback, useEffect } from 'react'
import { Check, AlertCircle, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import { useAutoSave } from '@/hooks/use-auto-save.hook'
import useWorkspaceContentStore from '@/stores/workspace-content.store'
import type { EditorBlock } from '@/components/editor/editor'

// Load Editor.js only on the client (no SSR — uses DOM APIs)
const Editor = dynamic(
  () => import('@/components/editor/editor').then((m) => m.Editor),
  { ssr: false, loading: () => <div className="animate-pulse h-40 rounded-md bg-muted" /> },
)

interface PageData {
  id: string
  title: string
  content: EditorBlock[]
  workspaceId: string
}

interface PageEditorProps {
  page: PageData
}

function SaveStatusIndicator({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      {status === 'saving' && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === 'saved' && <Check className="h-3 w-3 text-green-500" />}
      {status === 'error' && <AlertCircle className="h-3 w-3 text-destructive" />}
      {status === 'saving' && 'Saving…'}
      {status === 'saved' && 'Saved'}
      {status === 'error' && 'Failed to save'}
    </span>
  )
}

export function PageEditor({ page }: PageEditorProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(page.content ?? [])
  const [title, setTitle] = useState(page.title)
  const [titleSaving, setTitleSaving] = useState(false)
  const [blockLimitError, setBlockLimitError] = useState(false)

  const updatePageTitleInStore = useWorkspaceContentStore((s) => s.updatePageTitle)

  const saveContent = useCallback(
    async (currentBlocks: EditorBlock[]) => {
      setBlockLimitError(false)
      try {
        await callWithAuth.patch(
          authApiPath.workspace.updatePageContent(page.workspaceId, page.id),
          { blocks: currentBlocks, blockCount: currentBlocks.length },
        )
      } catch (err: any) {
        if (err?.response?.data?.code === 'BLOCK_LIMIT_REACHED') {
          setBlockLimitError(true)
        }
        throw err
      }
    },
    [page.workspaceId, page.id],
  )

  const { status } = useAutoSave({ data: blocks, onSave: saveContent, delay: 2000 })

  // Debounced title save
  useEffect(() => {
    if (title === page.title) return
    setTitleSaving(true)
    const t = setTimeout(async () => {
      try {
        await callWithAuth.patch(
          authApiPath.workspace.updatePage(page.workspaceId, page.id),
          { title },
        )
        updatePageTitleInStore(page.id, title)
      } finally {
        setTitleSaving(false)
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [title, page, updatePageTitleInStore])

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="flex-1 bg-transparent text-3xl font-bold outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-2 ml-4">
          {titleSaving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          <SaveStatusIndicator status={status} />
        </div>
      </div>

      {/* Block limit warning */}
      {blockLimitError && (
        <div className="mx-8 mb-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
          Block limit reached on Free tier. Upgrade to add more content.
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-8 pb-16">
        <Editor
          initialBlocks={page.content}
          onChange={setBlocks}
          placeholder="Start writing…"
        />
      </div>
    </div>
  )
}
