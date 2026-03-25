'use client'

import { useState } from 'react'
import { ChevronsUpDownIcon, LogOutIcon, SparklesIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { SettingsDialog } from '../settings/settings-dialog'
import { cn } from '@/lib/utils'
import useSession from '@/hooks/use-session.hook'
import { getShortName } from '@/utils/text'
import callWithAuth from '@/services/auth.service'
import { authApiPath } from '@/configs/service.config'
import { removeSession } from '@/lib/session'
import { useRouter } from 'next/navigation'
import customServiceError from '@/utils/custom-service-error'
import { toast } from 'sonner'
import Link from 'next/link'
import { USER_MENUS } from '@/constants/user-menu.constant'

interface NavUserProps {
  isSecound?: boolean
}

export function NavUser({ isSecound = false }: NavUserProps) {
  const router = useRouter()

  const { isMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const { session } = useSession()

  const logout = async () => {
    try {
      await callWithAuth.post(authApiPath.auth.path.logout)

      removeSession()

      router.push('/')
    } catch (error) {
      const err = customServiceError(error)

      toast(err?.message ?? 'Something went wrong')
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                disabled={!session}
                className={cn(
                  isSecound
                    ? 'md:h-8 md:p-0'
                    : 'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
                )}
              >
                {session ? (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {getShortName(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {session.user.email}
                      </span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto size-4" />
                  </>
                ) : (
                  <>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-4" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            {session && (
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {getShortName(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {!session.user.package && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link href="/billing">
                          <SparklesIcon />
                          Upgrade to Pro
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {USER_MENUS.map((item) => (
                    <DropdownMenuItem
                      key={item.title}
                      className="cursor-pointer"
                      asChild
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SettingsDialog open={open} setOpen={setOpen} />
    </>
  )
}
