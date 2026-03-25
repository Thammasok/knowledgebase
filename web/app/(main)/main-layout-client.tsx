'use client'

import { useEffect } from 'react'
import { AppSidebar } from '@/components/layouts/main-layout/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/layouts/breadcrumbs'
import { NotificationPopover } from '@/components/layouts/main-layout/notification-popover'
import useSidebarStore from '@/stores/sidebar.store'

interface MainLayoutClientProps {
  children: React.ReactNode
}

const MainLayoutClient = ({ children }: MainLayoutClientProps) => {
  const { mainSidebarOpen, setMainSidebarOpen } = useSidebarStore()

  useEffect(() => {
    useSidebarStore.persist.rehydrate()
  }, [])

  return (
    <SidebarProvider open={mainSidebarOpen} onOpenChange={setMainSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 p-4 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Right actions */}
          <div className="ml-auto flex items-center">
            <NotificationPopover />
          </div>
        </header>
        <div id="main-content">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayoutClient
