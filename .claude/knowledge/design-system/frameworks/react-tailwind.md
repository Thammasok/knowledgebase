# React 19 + Tailwind v4 + shadcn/ui + TypeScript

Implementation patterns for building UIs with shadcn/ui component library.

> **Note:** This project uses [shadcn/ui](https://ui.shadcn.com) as the component library. Do NOT edit components in `components/ui/` manually — use `pnpm shadcn add <component>` to install/update components.

---

## Project Setup

```bash
# New Next.js project (includes Tailwind v4 + TypeScript)
npx create-next-app@latest my-app --typescript --tailwind --eslint --app

# Initialize shadcn/ui
pnpm dlx shadcn@latest init

# Add components as needed
pnpm shadcn add button input card dialog

# Additional dependencies (often auto-installed by shadcn)
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add motion  # for animations
```

---

## Tailwind v4 + shadcn/ui CSS Variables

In `app/globals.css`, shadcn/ui uses these CSS variable conventions:

```css
@import "tailwindcss";

@theme {
  /* shadcn/ui color naming convention */
  --background: #ffffff;
  --foreground: #0f172a;

  --card: #ffffff;
  --card-foreground: #0f172a;

  --popover: #ffffff;
  --popover-foreground: #0f172a;

  --primary: #2563eb;
  --primary-foreground: #ffffff;

  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;

  --muted: #f1f5f9;
  --muted-foreground: #64748b;

  --accent: #f1f5f9;
  --accent-foreground: #0f172a;

  --destructive: #dc2626;
  --destructive-foreground: #ffffff;

  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #2563eb;

  /* Typography */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* Radius — configure in components.json or here */
  --radius: 0.5rem;
}

/* Dark mode (shadcn convention) */
.dark {
  --background: #0f172a;
  --foreground: #f8fafc;

  --card: #0f172a;
  --card-foreground: #f8fafc;

  --popover: #0f172a;
  --popover-foreground: #f8fafc;

  --primary: #3b82f6;
  --primary-foreground: #ffffff;

  --secondary: #1e293b;
  --secondary-foreground: #f8fafc;

  --muted: #1e293b;
  --muted-foreground: #94a3b8;

  --accent: #1e293b;
  --accent-foreground: #f8fafc;

  --destructive: #ef4444;
  --destructive-foreground: #ffffff;

  --border: #1e293b;
  --input: #1e293b;
  --ring: #3b82f6;
}
```

---

## `cn` Utility

```ts
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## shadcn/ui Component Patterns

> **Important:** Install components via CLI, don't copy-paste: `pnpm shadcn add button`

### Button (shadcn/ui standard)

```tsx
// components/ui/button.tsx (installed via shadcn CLI)
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Variant mapping (legacy → shadcn)

| Old name | shadcn name | Use case |
|----------|-------------|----------|
| `solid` | `default` | Primary actions |
| `outline` | `outline` | Secondary actions |
| `ghost` | `ghost` | Tertiary/subtle actions |
| `destructive` | `destructive` | Dangerous actions |
| `link` | `link` | Inline text links |
| — | `secondary` | Alternative to outline |

### Input (shadcn/ui standard)

```tsx
// components/ui/input.tsx (installed via shadcn CLI)
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

---

## React 19 Features

### Server Actions (form mutations)

```tsx
// app/actions/profile.ts
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function updateProfile(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }
  // ... save to DB
  revalidatePath('/settings')
  return { success: true }
}
```

```tsx
// components/ProfileForm.tsx
'use client'
import { useActionState } from 'react'
import { updateProfile } from '@/app/actions/profile'

export function ProfileForm() {
  const [state, action, isPending] = useActionState(updateProfile, null)

  return (
    <form action={action}>
      <input name="name" required />
      {state?.error?.name && <p role="alert">{state.error.name[0]}</p>}
      <Button type="submit" loading={isPending}>Save</Button>
    </form>
  )
}
```

### use() for data fetching

```tsx
// app/users/page.tsx (Server Component)
import { Suspense } from 'react'
import { UserList } from './UserList'

async function getUsers() {
  const res = await fetch('/api/users', { next: { revalidate: 60 } })
  return res.json()
}

export default function UsersPage() {
  const usersPromise = getUsers()
  return (
    <Suspense fallback={<UserListSkeleton />}>
      <UserList promise={usersPromise} />
    </Suspense>
  )
}

// UserList.tsx (Client Component)
'use client'
import { use } from 'react'

export function UserList({ promise }: { promise: Promise<User[]> }) {
  const users = use(promise)  // suspends until resolved
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

---

## Theme Switching (light/dark)

```tsx
// hooks/useTheme.ts
'use client'
import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(saved ?? (prefersDark ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }
}
```
