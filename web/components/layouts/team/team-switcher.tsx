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
import TeamCreateModal from './team-create-modal'
import useTeamListsStore, { type Team } from '@/stores/team-list.store'
import { useTeamHook } from './use-team-list.hook'
import { setDebounce } from '@/utils/debounce'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

// ─── Team avatar ──────────────────────────────────────────────────────────────

function TeamAvatar({ team, size = 'md' }: { team: Team; size?: 'sm' | 'md' }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg text-white',
        size === 'sm' ? 'size-6' : 'size-8',
      )}
      style={{ backgroundColor: team.color }}
    >
      {team.logo ? (
        <DynamicIcon
          name={team.logo}
          className={cn('text-white', size === 'sm' ? 'size-3.5' : 'size-4')}
        />
      ) : (
        <span
          className={cn(
            'font-semibold leading-none',
            size === 'sm' ? 'text-[10px]' : 'text-xs',
          )}
        >
          {team.name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface TeamSwitcherProps {
  isSecound?: boolean
}

export function TeamSwitcher({ isSecound = false }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const { teams, setActiveTeam } = useTeamListsStore()
  const activeTeam = useTeamListsStore((state) => state.activeTeam)
  const { loading, loadingMore, total, fetchTeams, fetchMoreTeams } =
    useTeamHook()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const isFirstRender = useRef(true)

  useEffect(() => {
    const rehydrate = async () => {
      await useTeamListsStore.persist.rehydrate()
      setMounted(true)
    }
    rehydrate()
  }, [])

  // Fetch fresh list from API after hydration
  useEffect(() => {
    if (mounted) fetchTeams()
  }, [mounted, fetchTeams])

  // Re-fetch when search changes (debounced), skip initial render
  useEffect(() => {
    if (!mounted) return
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setDebounce(() => fetchTeams(search), 500)
  }, [search, mounted, fetchTeams])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      if (el.scrollHeight - el.scrollTop <= el.clientHeight + 80) {
        fetchMoreTeams(search)
      }
    },
    [fetchMoreTeams, search],
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
                {mounted && activeTeam ? (
                  <>
                    <TeamAvatar team={activeTeam} size="md" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {activeTeam.name}
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

            {mounted && teams && (
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side={isMobile ? 'bottom' : 'right'}
                sideOffset={4}
              >
                <div className="flex w-full justify-between items-center">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {`Teams (${total})`}
                  </DropdownMenuLabel>
                  <Link
                    href="/teams"
                    className={buttonVariants({ size: 'xs', variant: 'link' })}
                  >
                    All teams
                  </Link>
                </div>

                <DropdownMenuSeparator />

                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search teams..."
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList onScroll={handleScroll}>
                    {!loading && teams.length === 0 && (
                      <CommandEmpty>No teams found.</CommandEmpty>
                    )}
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <Spinner className="size-4" />
                      </div>
                    ) : (
                      <CommandGroup>
                        {teams.map((team) => (
                          <CommandItem
                            key={team.id}
                            value={team.name}
                            onSelect={() => setActiveTeam(team)}
                            className="cursor-pointer gap-2"
                          >
                            <TeamAvatar team={team} size="sm" />
                            <span className="truncate">{team.name}</span>
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
                        Add team
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <TeamCreateModal open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
