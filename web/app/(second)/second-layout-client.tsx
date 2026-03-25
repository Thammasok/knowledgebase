'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb } from '@/components/layouts/breadcrumbs'
import { Button } from '@/components/ui/button'
import useSidebarStore from '@/stores/sidebar.store'

interface SecondLayoutClientProps {
  children: React.ReactNode
}

const SecondLayoutClient = ({ children }: SecondLayoutClientProps) => {
  const router = useRouter()
  const { mainSidebarOpen, setMainSidebarOpen } = useSidebarStore()

  useEffect(() => {
    useSidebarStore.persist.rehydrate()
  }, [])

  return (
    <SidebarProvider open={mainSidebarOpen} onOpenChange={setMainSidebarOpen}>
      <SidebarInset>
        <header className="sticky shrink-0 top-0 flex items-center w-full gap-2 p-4 border-b bg-background">
          <Button
            onClick={() => router.back()}
            size="sm"
            variant="ghost"
            className="-ml-1"
          >
            <ArrowLeftIcon />
            Back
          </Button>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb />
        </header>
        <div id="main-content">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SecondLayoutClient
