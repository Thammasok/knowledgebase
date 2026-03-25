'use client'

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
import { TeamSwitcher } from '../team/team-switcher'

// const projects = [
//   {
//     name: 'Design Engineering',
//     url: '#',
//     icon: Frame,
//   },
//   {
//     name: 'Sales & Marketing',
//     url: '#',
//     icon: PieChart,
//   },
//   {
//     name: 'Travel',
//     url: '#',
//     icon: Map,
//   },
// ]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {toggleConfig.team ? <TeamSwitcher /> : <Logo />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MAIN_MENUS} iconMode={state === 'collapsed'} />
        {/* <NavProjects projects={projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
