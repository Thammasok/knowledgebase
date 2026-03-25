'use client'

import { useState, useEffect } from 'react'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/layouts/chat-layout/app-sidebar'
import { Button } from '@/components/ui/button'
import { MessagesSquareIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import ChatContent from '@/components/layouts/chat-layout/chat-content'
import { Breadcrumb } from '@/components/layouts/breadcrumbs'
import useSidebarStore from '@/stores/sidebar.store'

const MIN_SIDEBAR_WIDTH = 350
const MAX_SIDEBAR_WIDTH = 560
const DEFAULT_SIDEBAR_WIDTH = 350

interface ChatLayoutClientProps {
  children: React.ReactNode
}

const ChatLayoutClient = ({ children }: ChatLayoutClientProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const [chatListOpen, setChatListOpen] = useState(false)
  const { secondarySidebarOpen, setSecondarySidebarOpen } = useSidebarStore()

  useEffect(() => {
    useSidebarStore.persist.rehydrate()
  }, [])

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = sidebarWidth

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(
        MAX_SIDEBAR_WIDTH,
        Math.max(MIN_SIDEBAR_WIDTH, startWidth + e.clientX - startX),
      )
      setSidebarWidth(newWidth)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <SidebarProvider
      open={secondarySidebarOpen}
      onOpenChange={setSecondarySidebarOpen}
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      <AppSidebar />

      {/* Mobile chat list sheet */}
      <Sheet open={chatListOpen} onOpenChange={setChatListOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="p-0 w-[18rem]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Chat List</SheetTitle>
          </SheetHeader>
          <ChatContent className="flex" />
        </SheetContent>
      </Sheet>

      {/* Chat list resize handle */}
      <div
        onMouseDown={startResize}
        className="fixed inset-y-0 z-50 w-1 cursor-col-resize bg-transparent transition-colors hover:bg-primary/30 active:bg-primary/50"
        style={{ left: `${sidebarWidth - 1}px` }}
      />

      <SidebarInset>
        <header className="sticky h-14 top-0 flex shrink-0 items-center gap-2 p-4 border-b bg-background">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="md:mr-2 data-[orientation=vertical]:h-4"
          />

          {/* Mobile chat list */}
          <Button
            id="mobile-chat-list-button"
            variant="ghost"
            size="icon"
            className="md:hidden size-7"
            onClick={() => setChatListOpen(true)}
          >
            <MessagesSquareIcon />
          </Button>

          {/* Breadcrumb */}
          <Breadcrumb />
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ChatLayoutClient
