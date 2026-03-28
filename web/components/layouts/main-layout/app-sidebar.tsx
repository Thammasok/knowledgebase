'use client'

import { useEffect } from 'react'
import Logo from './logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavMain } from '@/components/layouts/nav-main'
import { NavUser } from '@/components/layouts/nav-user'
import { MAIN_MENUS } from '@/constants/menu.constant'
import { toggleConfig } from '@/configs/toggle.config'
import { WorkspaceSwitcher } from '../workspace/workspace-switcher'
import { NavWorkspaceContent } from './nav-workspace-content'
import useWorkspaceListsStore from '@/stores/workspace-list.store'
import { useWorkspaceContent } from '@/hooks/use-workspace-content.hook'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const activeWorkspace = useWorkspaceListsStore((s) => s.activeWorkspace)
  const { loadContent } = useWorkspaceContent()

  useEffect(() => {
    if (activeWorkspace?.id) {
      loadContent(activeWorkspace.id)
    }
  }, [activeWorkspace?.id, loadContent])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {toggleConfig.workspace ? <WorkspaceSwitcher /> : <Logo />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MAIN_MENUS} iconMode={state === 'collapsed'} />
        {activeWorkspace && state !== 'collapsed' && (
          <NavWorkspaceContent workspaceId={activeWorkspace.id} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
