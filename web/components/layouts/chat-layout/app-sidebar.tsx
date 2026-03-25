'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { NavMain } from '../nav-main'
import { NavUser } from '../nav-user'
import ChatContent from './chat-content'
import { TeamSwitcher } from '../team/team-switcher'
import { MAIN_MENUS } from '@/constants/menu.constant'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* Icon rail - desktop only */}
      <Sidebar
        collapsible="none"
        className="hidden md:flex w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <TeamSwitcher isSecound />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={MAIN_MENUS} iconMode />
        </SidebarContent>
        <SidebarFooter>
          <NavUser isSecound />
        </SidebarFooter>
      </Sidebar>

      {/* Mobile nav menu - shown in mobile Sheet, hidden on desktop */}
      <div className="flex flex-col md:hidden">
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <div className="flex-1 overflow-y-auto">
          <NavMain items={MAIN_MENUS} />
        </div>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </div>

      {/* Chat list - desktop only */}
      <ChatContent />
    </Sidebar>
  )
}
