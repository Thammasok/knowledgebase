'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  XIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export type Channel = 'facebook' | 'line' | 'instagram' | 'telegram' | 'web'

export const channelConfig: Record<
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

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export interface Contact {
  name: string
  channel: Channel
  email: string
  phone: string
  location: string
  joinedAt: string
  totalConversations: number
  note: string
}

interface ContactProfileSidebarProps {
  contact: Contact
  open: boolean
  onClose: () => void
}

const MIN_WIDTH = 288
const MAX_WIDTH = 480
const DEFAULT_WIDTH = 288 // w-72

export function ContactProfileSidebar({
  contact,
  open,
  onClose,
}: ContactProfileSidebarProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const channel = channelConfig[contact.channel]

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width

    const onMouseMove = (e: MouseEvent) => {
      // Dragging left → increases width (handle is on the left edge)
      const newWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, startWidth + startX - e.clientX),
      )
      setWidth(newWidth)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      className={cn(
        'relative flex shrink-0 flex-col border-l bg-background mt-1',
        open
          ? 'animate-in slide-in-from-left-2'
          : 'animate-out slide-out-to-right-5 hidden',
      )}
      style={{ width }}
    >
      {/* Resize handle on left edge */}
      <div
        onMouseDown={startResize}
        className="absolute inset-y-0 left-0 z-10 w-1 cursor-col-resize bg-transparent transition-colors hover:bg-primary/30 active:bg-primary/50"
      />
      <div className="flex items-center justify-between p-3.5">
        <span className="text-sm font-semibold">Contact Info</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onClose}
          aria-label="Close profile"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center gap-2 px-4 py-6">
          <div className="relative">
            <Avatar className="size-16">
              <AvatarImage src={undefined} alt={contact.name} />
              <AvatarFallback className="text-lg">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold uppercase',
                channel.bg,
                channel.text,
              )}
            >
              {channel.icon}
            </span>
          </div>
          <p className="text-base font-semibold">{contact.name}</p>
          <p className={cn('text-xs font-medium', channel.text)}>
            via {channel.label}
          </p>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 px-4 py-4 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MailIcon className="size-4 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <PhoneIcon className="size-4 shrink-0" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            <span>{contact.location}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <CalendarIcon className="size-4 shrink-0" />
            <span>Joined {contact.joinedAt}</span>
          </div>
        </div>

        <Separator />

        <div className="px-4 py-4">
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Stats
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Conversations</span>
            <span className="font-medium">{contact.totalConversations}</span>
          </div>
        </div>

        <Separator />

        <div className="px-4 py-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Note
          </p>
          <p className="text-sm text-muted-foreground">{contact.note}</p>
        </div>
      </ScrollArea>
    </div>
  )
}
