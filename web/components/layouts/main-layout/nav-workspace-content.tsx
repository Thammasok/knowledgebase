'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  MoreHorizontal,
  Trash2,
  Pencil,
} from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useWorkspaceContent } from '@/hooks/use-workspace-content.hook'
import type { Folder as FolderType, Page } from '@/stores/workspace-content.store'

interface NavWorkspaceContentProps {
  workspaceId: string
}

function buildTree(folders: FolderType[], pages: Page[]) {
  const folderMap = new Map<string, FolderType & { children: FolderType[]; pages: Page[] }>()

  folders.forEach((f) =>
    folderMap.set(f.id, { ...f, children: [], pages: [] }),
  )

  const roots: (FolderType & { children: FolderType[]; pages: Page[] })[] = []

  folders.forEach((f) => {
    const node = folderMap.get(f.id)!
    if (f.parentId) {
      folderMap.get(f.parentId)?.children.push(node)
    } else {
      roots.push(node)
    }
  })

  pages.forEach((p) => {
    if (p.folderId && !p.parentPageId) {
      folderMap.get(p.folderId)?.pages.push(p)
    }
  })

  const rootPages = pages.filter((p) => !p.folderId && !p.parentPageId)

  return { roots, rootPages }
}

function getSubPages(pages: Page[], parentPageId: string): Page[] {
  return pages.filter((p) => p.parentPageId === parentPageId)
}

interface PageItemProps {
  page: Page
  pages: Page[]
  workspaceId: string
  depth?: number
  onDelete: (pageId: string) => void
  onRename: (pageId: string, current: string) => void
}

function PageItem({ page, pages, workspaceId, depth = 0, onDelete, onRename }: PageItemProps) {
  const router = useRouter()
  const subPages = getSubPages(pages, page.id)
  const [open, setOpen] = useState(false)

  const handleNavigate = () => router.push(`/p/${page.id}?ws=${workspaceId}`)

  if (subPages.length === 0) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild>
          <div className="flex w-full items-center justify-between group/page">
            <button
              onClick={handleNavigate}
              className="flex flex-1 items-center gap-1.5 truncate text-left"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{page.title || 'Untitled'}</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="invisible group-hover/page:visible p-0.5 rounded">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right">
                <DropdownMenuItem onClick={() => onRename(page.id, page.title)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(page.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <SidebarMenuSubItem>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton className="group/page">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-1 items-center gap-1.5 truncate">
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
                />
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <button onClick={handleNavigate} className="truncate text-left">
                  {page.title || 'Untitled'}
                </button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="invisible group-hover/page:visible p-0.5 rounded">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="right">
                  <DropdownMenuItem onClick={() => onRename(page.id, page.title)}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(page.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subPages.map((sub) => (
              <PageItem
                key={sub.id}
                page={sub}
                pages={pages}
                workspaceId={workspaceId}
                depth={depth + 1}
                onDelete={onDelete}
                onRename={onRename}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  )
}

interface FolderNodeType extends FolderType {
  children: FolderNodeType[]
  pages: Page[]
}

interface FolderItemProps {
  folder: FolderNodeType
  allPages: Page[]
  workspaceId: string
  onDeleteFolder: (id: string) => void
  onRenameFolder: (id: string, current: string) => void
  onAddPage: (folderId: string) => void
  onDeletePage: (id: string) => void
  onRenamePage: (id: string, current: string) => void
}

function FolderItem({
  folder,
  allPages,
  workspaceId,
  onDeleteFolder,
  onRenameFolder,
  onAddPage,
  onDeletePage,
  onRenamePage,
}: FolderItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarMenuItem>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center group/folder">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex-1">
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
              />
              {open ? (
                <FolderOpen className="h-4 w-4 shrink-0" />
              ) : (
                <Folder className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate">{folder.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <div className="flex items-center gap-0.5 invisible group-hover/folder:visible pr-1">
            <button
              onClick={() => onAddPage(folder.id)}
              className="rounded p-0.5 hover:bg-sidebar-accent"
              title="New page in folder"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded p-0.5 hover:bg-sidebar-accent">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right">
                <DropdownMenuItem onClick={() => onRenameFolder(folder.id, folder.name)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDeleteFolder(folder.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CollapsibleContent>
          <SidebarMenuSub>
            {/* Child folders */}
            {folder.children.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <FolderItem
                  folder={child as FolderNodeType}
                  allPages={allPages}
                  workspaceId={workspaceId}
                  onDeleteFolder={onDeleteFolder}
                  onRenameFolder={onRenameFolder}
                  onAddPage={onAddPage}
                  onDeletePage={onDeletePage}
                  onRenamePage={onRenamePage}
                />
              </SidebarMenuSubItem>
            ))}
            {/* Pages in this folder */}
            {folder.pages.map((page) => (
              <PageItem
                key={page.id}
                page={page}
                pages={allPages}
                workspaceId={workspaceId}
                onDelete={onDeletePage}
                onRename={onRenamePage}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

export function NavWorkspaceContent({ workspaceId }: NavWorkspaceContentProps) {
  const router = useRouter()
  const { folders, pages, loading, createFolder, renameFolder, deleteFolder, createPage, renamePage, deletePage } =
    useWorkspaceContent()

  const { roots, rootPages } = buildTree(folders, pages)

  const handleNewFolder = useCallback(async () => {
    const name = prompt('Folder name')
    if (!name?.trim()) return
    await createFolder(workspaceId, name.trim())
  }, [workspaceId, createFolder])

  const handleRenameFolder = useCallback(
    async (id: string, current: string) => {
      const name = prompt('Rename folder', current)
      if (!name?.trim() || name === current) return
      await renameFolder(workspaceId, id, name.trim())
    },
    [workspaceId, renameFolder],
  )

  const handleDeleteFolder = useCallback(
    async (id: string) => {
      if (!confirm('Delete this folder and all its pages?')) return
      await deleteFolder(workspaceId, id)
    },
    [workspaceId, deleteFolder],
  )

  const handleNewPage = useCallback(
    async (folderId?: string | null) => {
      const page = await createPage(workspaceId, { folderId })
      router.push(`/p/${page.id}?ws=${workspaceId}`)
    },
    [workspaceId, createPage, router],
  )

  const handleRenamePage = useCallback(
    async (id: string, current: string) => {
      const title = prompt('Rename page', current)
      if (!title?.trim() || title === current) return
      await renamePage(workspaceId, id, title.trim())
    },
    [workspaceId, renamePage],
  )

  const handleDeletePage = useCallback(
    async (id: string) => {
      if (!confirm('Delete this page?')) return
      await deletePage(workspaceId, id)
    },
    [workspaceId, deletePage],
  )

  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <div className="px-3 py-1 text-xs text-muted-foreground">Loading…</div>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-3 py-1">
        <SidebarGroupLabel className="p-0">Pages</SidebarGroupLabel>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleNewFolder}
            className="rounded p-0.5 hover:bg-sidebar-accent"
            title="New folder"
          >
            <Folder className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleNewPage(null)}
            className="rounded p-0.5 hover:bg-sidebar-accent"
            title="New page"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <SidebarMenu>
        {/* Folders with their pages */}
        {roots.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder as FolderNodeType}
            allPages={pages}
            workspaceId={workspaceId}
            onDeleteFolder={handleDeleteFolder}
            onRenameFolder={handleRenameFolder}
            onAddPage={(folderId) => handleNewPage(folderId)}
            onDeletePage={handleDeletePage}
            onRenamePage={handleRenamePage}
          />
        ))}

        {/* Root-level pages (no folder) */}
        {rootPages.length > 0 && (
          <SidebarMenuItem>
            <SidebarMenuSub>
              {rootPages.map((page) => (
                <PageItem
                  key={page.id}
                  page={page}
                  pages={pages}
                  workspaceId={workspaceId}
                  onDelete={handleDeletePage}
                  onRename={handleRenamePage}
                />
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
        )}

        {/* Empty state */}
        {roots.length === 0 && rootPages.length === 0 && (
          <SidebarMenuItem>
            <button
              onClick={() => handleNewPage(null)}
              className="w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground text-left"
            >
              + New page
            </button>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
