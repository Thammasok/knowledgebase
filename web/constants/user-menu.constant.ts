import { BellIcon, CreditCardIcon, LucideIcon, PaletteIcon, SettingsIcon, UserIcon } from "lucide-react"

export interface MenuItem {
  title: string
  url: string
  onClick?: () => void
  icon?: LucideIcon
}

export const USER_MENUS: MenuItem[] = [
  {
    title: 'Profile',
    url: '/settings/profile',
    icon: UserIcon,
  },
  {
    title: 'Appearance',
    url: '/settings/appearance',
    icon: PaletteIcon,
  },
  {
    title: 'Notifications',
    url: '/settings/notifications',
    icon: BellIcon,
  },
  {
    title: 'Billing & Plans',
    url: '/settings/billing',
    icon: CreditCardIcon,
  },
  {
    title: 'Settings',
    url: '/settings/',
    icon: SettingsIcon,
  },
]