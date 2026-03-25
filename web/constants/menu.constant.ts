import {
  BotIcon,
  DatabaseIcon,
  MessagesSquareIcon,
  MonitorIcon,
  PackageIcon,
  PuzzleIcon,
  type LucideIcon,
} from 'lucide-react'

export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: {
    title: string
    url: string
  }[]
}

export const MAIN_MENUS: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: MonitorIcon,
  },
  {
    title: 'Chat',
    url: '/chats',
    icon: MessagesSquareIcon,
  },
  {
    title: 'Products & Services',
    url: '#',
    icon: PackageIcon,
    items: [
      {
        title: 'Products',
        url: '#',
      },
      {
        title: 'Services',
        url: '#',
      },
    ],
  },
  {
    title: 'Agents',
    url: '#',
    icon: BotIcon,
    items: [
      {
        title: 'Overview',
        url: '#',
      },
      {
        title: 'AI Agents',
        url: '#',
      },
    ],
  },
  {
    title: 'Databases',
    url: '#',
    icon: DatabaseIcon,
  },
  {
    title: 'Integrations',
    url: '#',
    icon: PuzzleIcon,
    items: [
      {
        title: 'Chat',
        url: '#',
      },
      {
        title: 'Facebook Page',
        url: '#',
      },
      {
        title: 'Social Media',
        url: '#',
      },
      {
        title: 'E-Commerce',
        url: '#',
      },
      {
        title: 'Line OA',
        url: '#',
      },
    ],
  },
]
