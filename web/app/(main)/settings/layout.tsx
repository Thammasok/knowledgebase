'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  BellIcon,
  CreditCardIcon,
  DatabaseIcon,
  GlobeIcon,
  PaletteIcon,
  ShieldIcon,
  UserIcon,
  ZapIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ─── Nav config ───────────────────────────────────────────────────────────────

type NavItem = {
  id: string
  label: string
  icon: React.ElementType
  badge?: string
}

const NAV_GROUPS: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { id: 'profile', label: 'Profile', icon: UserIcon },
      { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
      { id: 'notifications', label: 'Notifications', icon: BellIcon },
    ],
  },
  {
    title: 'Security',
    items: [
      { id: 'security', label: 'Account & Security', icon: ShieldIcon },
      { id: 'privacy', label: 'Privacy & Data', icon: DatabaseIcon },
    ],
  },
  {
    title: 'Billing',
    items: [{ id: 'billing', label: 'Billing & Plans', icon: CreditCardIcon }],
  },
  {
    title: 'Advanced',
    items: [
      {
        id: 'models',
        label: 'Models & Features',
        icon: ZapIcon,
        badge: 'Beta',
      },
      { id: 'language', label: 'Language & Region', icon: GlobeIcon },
    ],
  },
]

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items)

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // slug is the last path segment, e.g. /settings/profile → 'profile'
  const activeId = pathname.split('/').at(-1) ?? 'profile'

  const navigate = (id: string) => router.push(`/settings/${id}`)

  return (
    <div className="md:p-6 md:space-y-4">
      {/* Header */}
      <div className="md:flex items-center justify-between hidden">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your settings</p>
        </div>
      </div>
      <div className="flex flex-col min-h-[calc(100vh-57px)]">
        {/* Mobile: horizontal scrollable tab bar */}
        <div className="md:hidden sticky top-15.25 z-10 border-b bg-background">
          <div className="flex overflow-x-auto scrollbar-none px-3 py-2 gap-1">
            {ALL_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={[
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors',
                  activeId === item.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body: desktop left nav + page content */}
        <div className="flex flex-1">
          {/* Desktop: vertical left nav */}
          <aside className="w-56 shrink-0 px-3 py-6 hidden md:flex md:flex-col">
            <nav className="space-y-6">
              {NAV_GROUPS.map((group, gi) => (
                <div key={gi} className="space-y-0.5">
                  {group.title && (
                    <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </p>
                  )}
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={[
                        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                        activeId === item.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      ].join(' ')}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          {/* Page content injected here */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
