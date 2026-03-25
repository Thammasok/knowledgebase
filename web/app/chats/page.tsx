'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { SendIcon } from 'lucide-react'
import {
  ContactProfileSidebar,
  channelConfig,
  type Channel,
  type Contact,
} from '@/components/layouts/chat-layout/contact-profile-sidebar'

type Sender = 'customer' | 'agent'

interface Message {
  id: string
  sender: Sender
  text: string
  time: string
}

const contact: Contact = {
  name: 'William Smith',
  channel: 'facebook' as Channel,
  email: 'williamsmith@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, USA',
  joinedAt: 'January 2024',
  totalConversations: 12,
  note: 'Loyal customer. Prefers email follow-ups.',
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'customer',
    text: 'Hi! I need help with my order.',
    time: '09:30 AM',
  },
  {
    id: '2',
    sender: 'agent',
    text: "Hello William! I'd be happy to help. Could you please share your order number?",
    time: '09:31 AM',
  },
  {
    id: '3',
    sender: 'customer',
    text: "Sure, it's #ORD-20483.",
    time: '09:32 AM',
  },
  {
    id: '4',
    sender: 'agent',
    text: "Got it! I can see your order. It's currently being prepared and is expected to ship by tomorrow.",
    time: '09:33 AM',
  },
  {
    id: '5',
    sender: 'customer',
    text: "That's great, thank you! Will I receive a tracking number?",
    time: '09:34 AM',
  },
  {
    id: '6',
    sender: 'agent',
    text: "Yes, you'll receive a tracking number via email once the order ships. Is there anything else I can help you with?",
    time: '09:34 AM',
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const channel = channelConfig[contact.channel]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: 'agent', text, time: now },
    ])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Chat area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Contact header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="relative shrink-0 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="View contact profile"
          >
            <Avatar className="size-9">
              <AvatarImage src={undefined} alt={contact.name} />
              <AvatarFallback className="text-xs">
                {getInitials(contact.name)}
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
          </button>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="min-w-0 text-left focus-visible:outline-none"
          >
            <p className="truncate text-sm font-semibold leading-tight">
              {contact.name}
            </p>
            <p className={cn('text-xs font-medium', channel.text)}>
              {channel.label}
            </p>
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="min-h-0 flex-1 px-4 py-4">
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent'
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex items-end gap-2',
                    isAgent ? 'flex-row-reverse' : 'flex-row',
                  )}
                >
                  {!isAgent && (
                    <Avatar className="size-7 shrink-0">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                      isAgent
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-bl-sm bg-muted text-foreground',
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {msg.time}
                  </span>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              className="max-h-32 min-h-8 flex-1 resize-none"
            />
            <Button
              type="submit"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <SendIcon className="size-4" />
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Profile sidebar */}
      <ContactProfileSidebar
        contact={contact}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  )
}
