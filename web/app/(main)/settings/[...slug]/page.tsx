'use client'

import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'
import { MembersSection } from '@/components/settings/members-section'
import {
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  KeyRoundIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
  ZapIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useAccountProfileHook } from '@/components/settings/use-account-profile.hook'

// ─── Section metadata ─────────────────────────────────────────────────────────

const SECTION_META: Record<string, { title: string; description: string }> = {
  members: {
    title: 'Members',
    description: 'Invite team members and manage their roles in this workspace',
  },
  profile: {
    title: 'Profile',
    description: 'Manage your name and public information',
  },
  appearance: {
    title: 'Appearance',
    description: 'Customize how SAN.ai looks and feels',
  },
  notifications: {
    title: 'Notifications',
    description: 'Control the emails and alerts you receive',
  },
  security: {
    title: 'Account & Security',
    description: 'Manage your password and active sessions',
  },
  privacy: {
    title: 'Privacy & Data',
    description: 'Control how your data is collected and used',
  },
  models: {
    title: 'Models & Features',
    description: 'Configure default AI model and feature preferences',
  },
  language: {
    title: 'Language & Region',
    description: 'Set your language, date, and timezone preferences',
  },
  billing: {
    title: 'Billing & Plans',
    description: 'Manage your subscription, usage, and payment methods',
  },
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function ProfileSection() {
  const { form, email, loading, submitting, onSubmit } = useAccountProfileHook()

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground select-none">
            {(form.watch('displayName') || email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">Profile picture</p>
            <p className="text-xs text-muted-foreground">
              Your initials are used as your avatar
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input
                  placeholder="How you appear in conversations"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is how your name will appear in chat and across the app.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Email address</Label>
          <Input
            type="email"
            className="cursor-not-allowed opacity-60"
            value={email}
            disabled
          />
          <p className="text-xs text-muted-foreground">
            Your email address cannot be changed here.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ─── Appearance ───────────────────────────────────────────────────────────────

function AppearanceSection() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Theme</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose how SAN.ai looks to you.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { value: 'light', label: 'Light', icon: SunIcon },
              { value: 'dark', label: 'Dark', icon: MoonIcon },
              { value: 'system', label: 'System', icon: LaptopIcon },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={[
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-colors',
                theme === value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/40',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Font size</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjust the size of text in conversations.
          </p>
        </div>
        <RadioGroup
          value={fontSize}
          onValueChange={(v) => setFontSize(v as typeof fontSize)}
          className="space-y-2"
        >
          {(
            [
              { value: 'sm', label: 'Small', desc: '13px' },
              { value: 'md', label: 'Default', desc: '15px' },
              { value: 'lg', label: 'Large', desc: '17px' },
            ] as const
          ).map(({ value, label, desc }) => (
            <div key={value} className="flex items-center gap-3">
              <RadioGroupItem value={value} id={`font-${value}`} />
              <Label htmlFor={`font-${value}`} className="cursor-pointer">
                {label}{' '}
                <span className="text-xs text-muted-foreground">({desc})</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────

const NOTIF_ROWS = [
  {
    id: 'email_updates',
    label: 'Product updates',
    description: 'News about features and improvements',
  },
  {
    id: 'email_tips',
    label: 'Tips & tutorials',
    description: 'Helpful guides for getting the most out of SAN.ai',
  },
  {
    id: 'email_security',
    label: 'Security alerts',
    description: 'Important notifications about your account security',
  },
]

function NotificationsSection() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    email_updates: true,
    email_tips: false,
    email_security: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">Email notifications</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage the emails you receive from SAN.ai.
        </p>
      </div>
      <div className="rounded-xl border divide-y">
        {NOTIF_ROWS.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between px-4 py-3.5"
          >
            <div>
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.description}</p>
            </div>
            <Switch
              checked={enabled[row.id] ?? false}
              onCheckedChange={(v) =>
                setEnabled((prev) => ({ ...prev, [row.id]: v }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Security ─────────────────────────────────────────────────────────────────

function SecuritySection() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <KeyRoundIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">
                Last changed over 30 days ago
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Change password
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Active sessions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Devices that are currently signed in to your account.
          </p>
        </div>
        <div className="rounded-xl border divide-y">
          {[
            {
              name: 'Current session',
              detail: 'This device · just now',
              current: true,
            },
          ].map((session) => (
            <div
              key={session.name}
              className="flex items-center justify-between px-4 py-3.5"
            >
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  {session.name}
                  {session.current && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.detail}
                </p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-destructive">Danger zone</h3>
        <div className="rounded-xl border border-destructive/30 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm" className="shrink-0">
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Privacy ──────────────────────────────────────────────────────────────────

function PrivacySection() {
  const [prefs, setPrefs] = useState({
    improve_models: true,
    usage_analytics: false,
    crash_reports: true,
  })

  const rows = [
    {
      id: 'improve_models' as const,
      label: 'Help improve SAN.ai',
      description:
        'Allow your conversations to be used to improve our AI models',
    },
    {
      id: 'usage_analytics' as const,
      label: 'Usage analytics',
      description: 'Share anonymous usage data to help improve the product',
    },
    {
      id: 'crash_reports' as const,
      label: 'Crash reports',
      description: 'Automatically send crash reports to help fix bugs',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">Data & privacy</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Control how your data is used.
        </p>
      </div>
      <div className="rounded-xl border divide-y">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between px-4 py-3.5"
          >
            <div>
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.description}</p>
            </div>
            <Switch
              checked={prefs[row.id]}
              onCheckedChange={(v) =>
                setPrefs((prev) => ({ ...prev, [row.id]: v }))
              }
            />
          </div>
        ))}
      </div>
      <div className="rounded-xl border px-4 py-4 space-y-3">
        <div>
          <p className="text-sm font-medium">Export your data</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download a copy of all your conversations and account data.
          </p>
        </div>
        <Button variant="outline" size="sm">
          Request data export
        </Button>
      </div>
    </div>
  )
}

// ─── Models ───────────────────────────────────────────────────────────────────

function ModelsSection() {
  const [defaultModel, setDefaultModel] = useState('claude-sonnet-4-6')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium">Default model</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choose which model is used by default for new conversations.
        </p>
      </div>
      <RadioGroup
        value={defaultModel}
        onValueChange={setDefaultModel}
        className="space-y-2"
      >
        {[
          {
            value: 'claude-opus-4-6',
            label: 'Claude Opus 4.6',
            desc: 'Most capable — best for complex tasks',
            badge: 'Pro',
          },
          {
            value: 'claude-sonnet-4-6',
            label: 'Claude Sonnet 4.6',
            desc: 'Balanced performance and speed',
          },
          {
            value: 'claude-haiku-4-5',
            label: 'Claude Haiku 4.5',
            desc: 'Fastest — great for simple tasks',
          },
        ].map(({ value, label, desc, badge }) => (
          <div
            key={value}
            className={[
              'flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-colors',
              defaultModel === value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/40',
            ].join(' ')}
            onClick={() => setDefaultModel(value)}
          >
            <RadioGroupItem value={value} id={`model-${value}`} />
            <div>
              <Label
                htmlFor={`model-${value}`}
                className="cursor-pointer font-medium flex items-center gap-2"
              >
                {label}
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </Label>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

// ─── Language ─────────────────────────────────────────────────────────────────

function LanguageSection() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border divide-y">
        {[
          { label: 'Language', value: 'English (US)' },
          { label: 'Date format', value: 'MM/DD/YYYY' },
          { label: 'Time format', value: '12-hour (AM/PM)' },
          { label: 'Timezone', value: 'Auto-detect' },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-3.5"
          >
            <div>
              <p className="text-sm font-medium">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.value}</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Billing ──────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For personal use and exploration',
    features: [
      '100 messages / month',
      'Access to Claude Haiku',
      '1 workspace',
      'Community support',
    ],
    current: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20',
    period: 'per month',
    description: 'For power users who need more',
    features: [
      'Unlimited messages',
      'Access to all models (Opus, Sonnet, Haiku)',
      '5 workspaces',
      'Priority support',
      'Early access to new features',
    ],
    current: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$30',
    period: 'per seat / month',
    description: 'For teams collaborating together',
    features: [
      'Everything in Pro',
      'Unlimited workspaces',
      'Team management & roles',
      'SSO / SAML',
      'Dedicated support',
      'Usage analytics',
    ],
    current: false,
  },
]

function BillingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly',
  )

  return (
    <div className="space-y-8">
      {/* Current plan summary */}
      <div className="rounded-xl border px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ZapIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Pro plan
              <Badge className="ml-2 text-xs" variant="secondary">
                Current
              </Badge>
            </p>
            <p className="text-xs text-muted-foreground">
              Renews on Apr 17, 2026 · $20 / month
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          Manage
        </Button>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Plan</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upgrade or downgrade your subscription.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1 text-xs">
          {(['monthly', 'yearly'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setBillingCycle(c)}
              className={[
                'rounded-md px-3 py-1 capitalize transition-colors',
                billingCycle === c
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {c}
              {c === 'yearly' && (
                <span className="ml-1 text-[10px] text-emerald-500 font-medium">
                  −20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={[
              'relative flex flex-col rounded-xl border-2 p-5 transition-colors',
              plan.current
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/40',
            ].join(' ')}
          >
            {plan.current && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-medium text-primary-foreground whitespace-nowrap">
                Current plan
              </span>
            )}

            <div className="mb-4">
              <p className="text-sm font-semibold">{plan.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {plan.description}
              </p>
            </div>

            <div className="mb-4">
              <span className="text-2xl font-bold">
                {billingCycle === 'yearly'
                  ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                  : plan.price}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">
                {plan.period}
              </span>
            </div>

            <ul className="mb-5 space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.current ? 'secondary' : 'outline'}
              size="sm"
              className="w-full"
              disabled={plan.current}
            >
              {plan.current ? 'Current plan' : `Upgrade to ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Payment method */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Payment method</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your billing information and saved cards.
          </p>
        </div>
        <div className="rounded-xl border divide-y">
          <div className="flex items-center justify-between px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-12 items-center justify-center rounded-md border bg-muted text-xs font-bold tracking-wider">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12 / 27</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <CreditCardIcon className="h-3.5 w-3.5" />
          Add payment method
        </Button>
      </div>

      <Separator />

      {/* Billing history */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Billing history</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download past invoices for your records.
          </p>
        </div>
        <div className="rounded-xl border divide-y">
          {[
            { date: 'Mar 17, 2026', amount: '$20.00', status: 'Paid' },
            { date: 'Feb 17, 2026', amount: '$20.00', status: 'Paid' },
            { date: 'Jan 17, 2026', amount: '$20.00', status: 'Paid' },
          ].map((invoice) => (
            <div
              key={invoice.date}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{invoice.date}</p>
                <p className="text-xs text-muted-foreground">
                  Pro plan · {invoice.amount}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs text-emerald-600">
                  {invoice.status}
                </Badge>
                <Button variant="ghost" size="sm" className="text-xs">
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function SectionContent({ slug }: { slug: string }) {
  switch (slug) {
    case 'members':
      return <MembersSection />
    case 'profile':
      return <ProfileSection />
    case 'appearance':
      return <AppearanceSection />
    case 'notifications':
      return <NotificationsSection />
    case 'security':
      return <SecuritySection />
    case 'privacy':
      return <PrivacySection />
    case 'models':
      return <ModelsSection />
    case 'language':
      return <LanguageSection />
    case 'billing':
      return <BillingSection />
    default:
      return notFound()
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsSlugPage() {
  const params = useParams<{ slug: string[] }>()
  const slug = params.slug?.[0] ?? 'profile'
  const meta = SECTION_META[slug]

  if (!meta) return notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{meta.title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {meta.description}
        </p>
      </div>
      <Separator />
      <SectionContent slug={slug} />
    </div>
  )
}
