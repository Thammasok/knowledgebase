'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronsUpDownIcon, PlusIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import WorkspaceCreateModal from './workspace-create-modal'
import useWorkspaceListsStore, { type Workspace } from '@/stores/workspace-list.store'
import { useWorkspaceHook } from './use-workspace-list.hook'
import { setDebounce } from '@/utils/debounce'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

// ─── Workspace avatar ──────────────────────────────────────────────────────────

function WorkspaceAvatar({ workspace, size = 'md' }: { workspace: Workspace; size?: 'sm' | 'md' }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg text-white',
        size === 'sm' ? 'size-6' : 'size-8',
      )}
      style={{ backgroundColor: workspace.color }}
    >
      {workspace.logo ? (
        <DynamicIcon
          name={workspace.logo}
          className={cn('text-white', size === 'sm' ? 'size-3.5' : 'size-4')}
        />
      ) : (
        <span
          className={cn(
            'font-semibold leading-none',
            size === 'sm' ? 'text-[10px]' : 'text-xs',
          )}
        >
          {workspace.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WorkspaceSwitcherProps {
  isSecound?: boolean
}

export function WorkspaceSwitcher({ isSecound = false }: WorkspaceSwitcherProps) {
  const { isMobile } = useSidebar()
  const { workspaces, setActiveWorkspace } = useWorkspaceListsStore()
  const activeWorkspace = useWorkspaceListsStore((state) => state.activeWorkspace)
  const { loading, loadingMore, total, fetchWorkspaces, fetchMoreWorkspaces } =
    useWorkspaceHook()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    const rehydrate = async () => {
      await useWorkspaceListsStore.persist.rehydrate()
      setMounted(true)
    }
    rehydrate()
  }, [])

  // Fetch fresh list from API after hydration
  useEffect(() => {
    if (mounted) fetchWorkspaces()
  }, [mounted, fetchWorkspaces])

  // Re-fetch when search changes (debounced), skip initial render
  useEffect(() => {
    if (!mounted) return
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setDebounce(() => fetchWorkspaces(search), 500)
  }, [search, mounted, fetchWorkspaces])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      if (el.scrollHeight - el.scrollTop <= el.clientHeight + 80) {
        fetchMoreWorkspaces(search)
      }
    },
    [fetchMoreWorkspaces, search],
  )

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={cn(
                  'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                  isSecound ? 'md:h-8 md:p-0' : '',
                )}
                disabled={!mounted}
              >
                {mounted && activeWorkspace ? (
                  <>
                    <WorkspaceAvatar workspace={activeWorkspace} size="md" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {activeWorkspace.name}
                      </span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto" />
                  </>
                ) : (
                  <>
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-8" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            {mounted && workspaces && (
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side={isMobile ? 'bottom' : 'right'}
                sideOffset={4}
              >
                <div className="flex w-full justify-between items-center">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {`Workspaces (${total})`}
                  </DropdownMenuLabel>
                  <Link
                    href="/workspaces"
                    className={buttonVariants({ size: 'xs', variant: 'link' })}
                  >
                    All workspaces
                  </Link>
                </div>

                <DropdownMenuSeparator />

                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search workspaces..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList onScroll={handleScroll}>
                    {!loading && workspaces.length === 0 && (
                      <CommandEmpty>No workspaces found.</CommandEmpty>
                    )}
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <Spinner className="size-4" />
                      </div>
                    ) : (
                      <CommandGroup>
                        {workspaces.map((workspace) => (
                          <CommandItem
                            key={workspace.id}
                            value={workspace.name}
                            onSelect={() => setActiveWorkspace(workspace)}
                            className="cursor-pointer gap-2"
                          >
                            <WorkspaceAvatar workspace={workspace} size="sm" />
                            <span className="truncate">{workspace.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {loadingMore && (
                      <div className="flex justify-center py-2">
                        <Spinner className="size-3.5" />
                      </div>
                    )}
                  </CommandList>
                </Command>

                {!search && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 p-2"
                      onSelect={(e) => {
                        e.preventDefault()
                        setDialogOpen(true)
                      }}
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <PlusIcon className="size-4" />
                      </div>
                      <div className="font-medium text-muted-foreground">
                        Add workspace
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <WorkspaceCreateModal open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
