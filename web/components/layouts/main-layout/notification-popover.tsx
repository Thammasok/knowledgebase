'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { BellIcon, CheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// ─── Types ────────────────────────────────────────────────────────────────────

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL: Notification[] = [
  {
    id: '1',
    title: 'New team member added',
    description: 'Alex joined your team "Product".',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    title: 'Settings saved',
    description: 'Your profile changes have been saved.',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    title: 'Welcome to SAN.ai',
    description: 'Get started by exploring the dashboard.',
    time: '2d ago',
    read: true,
  },
  {
    id: '4',
    title: 'New team member added',
    description: 'Alex joined your team "Product".',
    time: '2m ago',
    read: true,
  },
  {
    id: '5',
    title: 'Settings saved',
    description: 'Your profile changes have been saved.',
    time: '1h ago',
    read: true,
  },
  {
    id: '6',
    title: 'Welcome to SAN.ai',
    description: 'Get started by exploring the dashboard.',
    time: '2d ago',
    read: true,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function NotificationPopover() {
  const [items, setItems] = useState<Notification[]>(INITIAL)

  const unreadCount = items.filter((n) => !n.read).length

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 flex flex-col max-h-112">
        {/* Fixed header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckIcon className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <Separator className="shrink-0" />

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <BellIcon className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            items.map((item, i) => (
              <div key={item.id}>
                <button
                  onClick={() => markRead(item.id)}
                  className={cn(
                    'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                    !item.read && 'bg-primary/5',
                  )}
                >
                  {/* Unread dot */}
                  <span className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <p
                      className={cn(
                        'text-sm truncate',
                        !item.read ? 'font-medium' : 'text-muted-foreground',
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {item.time}
                    </p>
                  </div>
                </button>
                {i < items.length - 1 && <Separator />}
              </div>
            ))
          )}
        </div>

        {/* Fixed footer */}
        {items.length > 0 && (
          <>
            <Separator className="shrink-0" />
            <div className="shrink-0 px-4 py-2">
              <button className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                View all notifications
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
