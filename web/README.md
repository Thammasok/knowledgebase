# San AI — Web

Frontend for the **San AI** platform — AI assistant for Business. Built with Next.js 16 App Router and React 19.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with CSS custom properties
- **UI Components:** shadcn/ui (New York style, neutral base)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Fonts:** Geist Sans + Geist Mono
- **Package Manager:** pnpm

## Project Structure

```text
web/
├── app/
│   ├── layout.tsx              # Root layout (fonts, global styles)
│   ├── page.tsx                # Home / landing page (/)
│   ├── auth/
│   │   └── login/
│   │       ├── page.tsx        # Login page (/auth/login)
│   │       └── login-form.tsx  # Login form component
│   ├── chat/                   # Chat route
│   │   ├── layout.tsx          # Chat layout with dual-panel sidebar
│   │   └── page.tsx            # Chat page (/chat)
│   └── (main)/                 # Authenticated route group
│       ├── layout.tsx          # Sidebar layout with breadcrumbs
│       └── dashboard/
│           └── page.tsx        # Dashboard (/dashboard)
├── components/
│   ├── ui/                     # shadcn/ui primitives (do not hand-edit)
│   ├── layouts/                # Page layout components
│   │   ├── menu.tsx            # Shared menu component
│   │   ├── main-layout/        # Main app sidebar & navigation
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── nav-main.tsx
│   │   │   ├── nav-projects.tsx
│   │   │   ├── nav-user.tsx
│   │   │   └── team-switcher.tsx
│   │   └── chat-layout/        # Chat-specific sidebar
│   │       ├── app-sidebar.tsx
│   │       └── nav-user.tsx
│   └── settings/
│       └── settings-dialog.tsx # Settings modal
├── hooks/
│   └── use-mobile.ts           # Responsive mobile detection (768px breakpoint)
├── lib/
│   └── utils.ts                # cn() — clsx + tailwind-merge utility
├── styles/
│   └── globals.css             # Tailwind CSS + theme CSS variables
├── components.json             # shadcn/ui configuration
├── next.config.ts
└── tsconfig.json
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server at http://localhost:3000 |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format all `.ts`/`.tsx` files with Prettier |

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing / home page |
| `/auth/login` | Login page |
| `/dashboard` | Dashboard (authenticated) |
| `/chat` | Chat interface with dual-panel sidebar |

The `(main)` route group wraps all authenticated pages with a shared layout: `AppSidebar`, `SidebarProvider`, breadcrumbs, and `SettingsDialog`.

## Components

### UI Primitives (`components/ui/`)

shadcn/ui components — add new ones with:

```bash
pnpm shadcn add <component-name>
```

Do not edit files in this directory manually.

### Layout (`components/layouts/`)

All layout components live under `components/layouts/`, grouped by which layout they belong to.

#### Main Layout (`components/layouts/main-layout/`)

| Component | Description |
|-----------|-------------|
| `AppSidebar` | Main sidebar with collapsible icon mode |
| `NavMain` | Expandable navigation menu |
| `NavProjects` | Projects section with per-item dropdown |
| `NavUser` | User menu in sidebar footer |
| `TeamSwitcher` | Team selection dropdown |

#### Chat Layout (`components/layouts/chat-layout/`)

| Component | Description |
|-----------|-------------|
| `AppSidebar` | Dual-panel sidebar — icon rail + message list |
| `NavUser` | User menu in chat sidebar footer |

### Settings (`components/settings/`)

`SettingsDialog` — modal with sidebar navigation across multiple settings categories (appearance, language, notifications, privacy, etc.).

## Path Alias

`@/*` maps to `web/*`:

```typescript
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
```

## Styling

Tailwind CSS v4 with theme tokens defined as CSS custom properties in `styles/globals.css`. Dark mode is supported via the `dark:` variant.

**Theme colors** use the `oklch` color space. Override in `globals.css` under `:root` (light) and `.dark` (dark mode).

## Code Style

Enforced by Prettier (`.prettierrc`):

- Single quotes
- No semicolons
- Trailing commas
- 2-space indent
- 80-character print width
