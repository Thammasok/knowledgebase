import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Channel = 'facebook' | 'line' | 'instagram' | 'telegram' | 'web'

interface ChatItem {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  time: string
  channel: Channel
  unread?: number
}

const chatMock: ChatItem[] = [
  {
    id: '1',
    name: 'William Smith',
    lastMessage: 'Hi! I need help with my order.',
    time: '09:34 AM',
    channel: 'facebook',
    unread: 3,
  },
  {
    id: '2',
    name: 'Alice Chen',
    lastMessage: 'ขอบคุณมากเลยค่ะ ได้รับสินค้าแล้ว',
    time: 'Yesterday',
    channel: 'line',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    lastMessage: 'When will my package arrive?',
    time: '2 days ago',
    channel: 'instagram',
    unread: 1,
  },
  {
    id: '4',
    name: 'Emily Davis',
    lastMessage: 'Can I change my delivery address?',
    time: '2 days ago',
    channel: 'telegram',
  },
  {
    id: '5',
    name: 'Michael Wilson',
    lastMessage: 'I would like to request a refund.',
    time: '1 week ago',
    channel: 'web',
  },
  {
    id: '6',
    name: 'Sarah Brown',
    lastMessage: 'Do you have this in size M?',
    time: '1 week ago',
    channel: 'facebook',
  },
  {
    id: '7',
    name: 'David Lee',
    lastMessage: 'สอบถามราคาสินค้าหน่อยครับ',
    time: '1 week ago',
    channel: 'line',
    unread: 2,
  },
  {
    id: '8',
    name: 'Olivia Wilson',
    lastMessage: 'Thank you for your quick response!',
    time: '1 week ago',
    channel: 'instagram',
  },
  {
    id: '9',
    name: 'James Martin',
    lastMessage: 'Is the promotion still available?',
    time: '1 week ago',
    channel: 'telegram',
  },
  {
    id: '10',
    name: 'Sophia White',
    lastMessage: 'I love the product, will order again.',
    time: '1 week ago',
    channel: 'web',
  },
]

const channelConfig: Record<
  Channel,
  { label: string; bg: string; text: string; icon: string }
> = {
  facebook: {
    label: 'Facebook',
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'f',
  },
  line: {
    label: 'LINE',
    bg: 'bg-green-100 dark:bg-green-900/40',
    text: 'text-green-600 dark:text-green-400',
    icon: 'L',
  },
  instagram: {
    label: 'IG',
    bg: 'bg-pink-100 dark:bg-pink-900/40',
    text: 'text-pink-600 dark:text-pink-400',
    icon: 'ig',
  },
  telegram: {
    label: 'TG',
    bg: 'bg-sky-100 dark:bg-sky-900/40',
    text: 'text-sky-600 dark:text-sky-400',
    icon: 'tg',
  },
  web: {
    label: 'Web',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    text: 'text-neutral-600 dark:text-neutral-400',
    icon: 'w',
  },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const ChatList = () => {
  return (
    <SidebarContent>
      <SidebarGroup className="px-0">
        <SidebarGroupContent>
          {chatMock.map((chat) => {
            const channel = channelConfig[chat.channel]
            return (
              <Link
                href="#"
                key={chat.id}
                className="flex items-start gap-3 border-b p-4 text-sm last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="relative shrink-0">
                  <Avatar className="size-9">
                    <AvatarImage src={chat.avatar} alt={chat.name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(chat.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      'absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full text-[9px] font-bold uppercase',
                      channel.bg,
                      channel.text,
                    )}
                  >
                    {channel.icon}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium leading-tight">
                      {chat.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {chat.time}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">
                      {chat.lastMessage}
                    </span>
                    {chat.unread && (
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

export default ChatList
