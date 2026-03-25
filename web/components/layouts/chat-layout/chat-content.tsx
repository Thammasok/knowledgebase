import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Sidebar, SidebarHeader, SidebarInput } from '@/components/ui/sidebar'
import ChatList from './chat-list'
import { cn } from '@/lib/utils'

interface ChatContentProps {
  className?: string
}

const ChatContent = ({ className }: ChatContentProps) => {
  return (
    <Sidebar
      collapsible="none"
      className={cn('hidden flex-1 md:flex', className)}
    >
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Chat</div>
          <Label className="flex items-center gap-2 text-sm">
            <span>Unreads</span>
            <Switch className="shadow-none" />
          </Label>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <ChatList />
    </Sidebar>
  )
}

export default ChatContent
