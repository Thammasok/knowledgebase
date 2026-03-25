export type BreadcrumbEntry = { name: string; url?: string }

export const BREADCRUMBS: { url: string; list: BreadcrumbEntry[] }[] = [
  {
    url: '/dashboard',
    list: [{ name: 'Dashboard' }],
  },
  {
    url: '/chats',
    list: [{ name: 'Chats' }],
  },
  {
    url: '/teams',
    list: [{ name: 'Teams' }],
  },
  {
    url: '/team/create',
    list: [{ name: 'Teams', url: '/team' }, { name: 'Create team' }],
  },
  {
    url: '/settings/profile',
    list: [{ name: 'Settings', url: '/settings' }, { name: 'Profile' }],
  },
  {
    url: '/settings/appearance',
    list: [{ name: 'Settings', url: '/settings' }, { name: 'Appearance' }],
  },
  {
    url: '/settings/notifications',
    list: [{ name: 'Settings', url: '/settings' }, { name: 'Notifications' }],
  },
  {
    url: '/settings/security',
    list: [
      { name: 'Settings', url: '/settings' },
      { name: 'Account & Security' },
    ],
  },
  {
    url: '/settings/privacy',
    list: [{ name: 'Settings', url: '/settings' }, { name: 'Privacy & Data' }],
  },
  {
    url: '/settings/models',
    list: [
      { name: 'Settings', url: '/settings' },
      { name: 'Models & Features' },
    ],
  },
  {
    url: '/settings/language',
    list: [
      { name: 'Settings', url: '/settings' },
      { name: 'Language & Region' },
    ],
  },
  {
    url: '/settings/billing',
    list: [
      { name: 'Settings', url: '/settings' },
      { name: 'Billing & Plans' },
    ],
  },
]