# Frontend Web Overview — Knowledgebase GPT

**Path:** `web/`
**Type:** Next.js 16 App Router SPA
**Date:** 2026-03-28

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Runtime | React | 19.2.3 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| Component Library | shadcn/ui (new-york style) | latest |
| Icons | Lucide React | 0.576 |
| Auth | NextAuth (beta) | 5.0.0-beta.30 |
| HTTP Client | Axios | 1.13 |
| State | Zustand | 5 |
| Forms | React Hook Form + Zod | 7.71 + 4.3 |
| Animation | tw-animate-css | — |
| Tables | TanStack React Table | 8.21 |
| Charts | Recharts | 2.15 |
| Dates | date-fns + dayjs | 4.1 + 1.11 |
| Device ID | FingerprintJS | 5.1 |
| Encryption | crypto-js | 4.2 |
| Theme | next-themes | 0.4 |
| Cookies | js-cookie | 3 |
| JWT (client) | jose | 6.2 |

---

## Development Commands

```bash
# Dev server at localhost:3000
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint & format
pnpm lint && pnpm format

# Add shadcn/ui component
pnpm shadcn add <component>
```

---

## Directory Structure

```
web/
├── app/                     # Next.js App Router — all pages and API routes
│   ├── (main)/              # Protected layout group (dashboard, settings, workspaces)
│   ├── (second)/            # Secondary layout group (workspace creation)
│   ├── auth/                # Public auth pages
│   ├── chats/               # Chat feature
│   ├── privacy/             # Privacy policy
│   ├── terms/               # Terms of service
│   ├── api/auth/[...nextauth]/  # NextAuth route handler
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page (/)
├── components/
│   ├── auth/                # OAuth buttons
│   ├── layouts/             # Page layout components (sidebar, nav, workspace)
│   ├── settings/            # Settings dialog
│   └── ui/                  # shadcn/ui primitives (54 components — do not edit)
├── configs/                 # Global config + API path map + feature toggles
├── constants/               # Static data (menus, colors, icons, breadcrumbs)
├── hooks/                   # Shared custom React hooks
├── lib/                     # Pure utilities (cn, cookies, JWT, session, dates)
├── services/                # Axios service instances (auth, global, refresh)
├── stores/                  # Zustand global state
├── styles/
│   └── globals.css          # Tailwind v4 theme + oklch CSS variables
└── utils/                   # Helper functions (format, slug, device ID, etc.)
```

---

## Route Map

### Public Routes

| URL | File | Purpose |
|-----|------|---------|
| `/` | `app/page.tsx` | Landing / home page |
| `/auth/login` | `app/auth/login/page.tsx` | Email + password login |
| `/auth/signup` | `app/auth/signup/page.tsx` | Register new account |
| `/auth/signup/complete` | `app/auth/signup/complete/page.tsx` | Post-signup confirmation |
| `/auth/otp` | `app/auth/otp/page.tsx` | Email OTP verification |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Request password reset |
| `/auth/new-password` | `app/auth/new-password/page.tsx` | Set new password |
| `/auth/request-access` | `app/auth/request-access/page.tsx` | Waitlist / invite request |
| `/auth/register-invite` | `app/auth/register-invite/page.tsx` | Sign up via approved invite |
| `/auth/oauth/callback` | `app/auth/oauth/callback/page.tsx` | OAuth provider callback |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |

### Protected Routes (require session)

| URL | File | Layout Group |
|-----|------|-------------|
| `/dashboard` | `app/(main)/dashboard/page.tsx` | `(main)` |
| `/workspaces` | `app/(main)/workspaces/page.tsx` | `(main)` |
| `/settings` | `app/(main)/settings/page.tsx` | `(main)` |
| `/settings/[...slug]` | `app/(main)/settings/[...slug]/page.tsx` | `(main)` |
| `/chats` | `app/chats/page.tsx` | Chat layout |
| `/workspace/create` | `app/(second)/workspace/create/page.tsx` | `(second)` |

### API Routes

| URL | Purpose |
|-----|---------|
| `/api/auth/[...nextauth]` | NextAuth handler (OAuth callbacks, session) |

---

## Layout Groups

```
app/
├── layout.tsx                   # Root: fonts, providers, theme
├── (main)/
│   ├── layout.tsx               # Server layout wrapper
│   ├── main-layout-client.tsx   # Client: checks session, renders sidebar
│   └── ...pages
├── (second)/
│   ├── layout.tsx               # Minimal layout (workspace creation)
│   └── second-layout-client.tsx
└── chats/
    ├── layout.tsx
    └── chat-layout-client.tsx   # Dual-panel chat layout
```

**Session guard:** `main-layout-client.tsx` reads the session cookie and redirects to `/auth/login` if absent. No Next.js middleware file — guard is layout-level.

---

## Authentication Flow

### Email/Password Signup
```
/auth/signup → POST /api/v1/auth/signup
  → email encrypted (CryptoJS) → localStorage "temp-to"
  → redirect /auth/otp
    → POST /api/v1/auth/verify/mail (send OTP, get ref)
    → PATCH /api/v1/auth/verify/mail (submit otp + ref)
    → redirect /auth/signup/complete
```

### Email/Password Login
```
/auth/login → POST /api/v1/auth/login
  → if isVerify = false → redirect /auth/otp
  → if isVerify = true  → setSession(tokens + user) → redirect /dashboard
```

### OAuth (Google / GitHub / Facebook)
```
Click OAuth button → NextAuth signIn(provider)
  → Provider redirect → NextAuth JWT callback
    → POST /api/v1/auth/oauth { provider, providerId, email, displayName, image }
    → Backend returns { token, account }
    → NextAuth stores tokens in JWT cookie
  → redirect /dashboard
```

### Token Refresh
```
Axios response interceptor detects 401
  → POST /api/v1/auth/refresh (Authorization: Bearer refreshToken)
  → Backend returns new { accessToken, refreshToken }
  → updateSession(newTokens) → retry original request
  → On refresh 401 → removeSession() → redirect /auth/login
```

---

## Services Layer (`services/`)

Three Axios instances:

| File | Instance | Auth | Usage |
|------|---------|------|-------|
| `global.service.ts` | `globalService` | None | Signup, login, forgot password, OTP, request-access |
| `auth.service.ts` | `authService` | Bearer + device ID | All authenticated API calls |
| `refresh.service.ts` | `refreshService` | Refresh token | Token renewal only |

**`auth.service.ts` interceptors:**
- Request: injects `Authorization: Bearer {accessToken}` and `x-device-id` headers from session cookie
- Response: on 401 → queues failed request → calls `refreshService` → retries; on refresh failure → clears session

---

## State Management (`stores/`)

| Store | File | State |
|-------|------|-------|
| Sidebar | `sidebar.store.ts` | `isCollapsed: boolean` |
| Workspace list | `workspace-list.store.ts` | `workspaces[]`, loading, selected |

Uses Zustand (no Redux, no Context for these).

---

## Shared Hooks (`hooks/`)

| Hook | Purpose |
|------|---------|
| `use-auth-signed.hook.ts` | Returns whether user has an active session |
| `use-session.hook.ts` | Get / set / remove session data |
| `use-device-id.hook.ts` | Generate + persist device fingerprint (FingerprintJS) |
| `use-countdown.hook.ts` | Countdown timer — used on OTP page for resend cooldown |
| `use-language.hook.ts` | Read / set locale (`en` \| `th`) |
| `use-mobile.ts` | Returns `true` when viewport < 768px |
| `use-on-click-outside.hook.ts` | Fires callback when user clicks outside a ref element |

---

## Page Hooks (co-located with pages)

Each auth page has its own co-located hook:

| Hook | Page | API Calls |
|------|------|-----------|
| `use-login.hook.ts` | `/auth/login` | POST `/auth/login` |
| `use-signup-hook.ts` | `/auth/signup` | POST `/auth/signup` |
| `use-otp.hook.ts` | `/auth/otp` | POST + PATCH `/auth/verify/mail` |
| `use-request-access.hook.ts` | `/auth/request-access` | POST `/auth/request-access` |
| `use-register-invite.hook.ts` | `/auth/register-invite` | POST `/auth/signup/request-access` |

Workspace hooks are in `components/layouts/workspace/`:

| Hook | Purpose |
|------|---------|
| `use-workspace-list.hook.ts` | Fetch workspace list from API |
| `use-workspace-create.hook.ts` | Create workspace form + submit |
| `use-workspace-edit.hook.ts` | Edit workspace form + submit |
| `use-workspace-table.hook.ts` | Table/list management |

---

## Session Management (`lib/session.ts`)

Custom session using a JWT-encoded cookie (not NextAuth's session — used for email/password auth):

```typescript
type TSessionInfoTypes = {
  token: { accessToken: string; refreshToken: string }
  user: { name: string; email: string; image: string; isVerify: boolean; package?: string }
}
```

| Function | Purpose |
|----------|---------|
| `getSession()` | Decode JWT from `session` cookie |
| `setSession(data)` | Encode + store in cookie (1-day expiry, secure, SameSite strict) |
| `removeSession()` | Delete cookie → logs user out |

Cookie key: `session`. JWT secret: `NEXTAUTH_SECRET` env var.

**Device ID:** Stored separately in `deviceId` cookie via FingerprintJS. Sent as `x-device-id` header on every API request.

---

## Configurations (`configs/`)

### `global.config.ts`

```typescript
{
  app: { name: 'Know', ... }
  session: {
    cookieKey: 'session',
    jwtSecret: process.env.NEXTAUTH_SECRET,
    expiresIn: { jwt: '1d', cookie: 1 day }
    ignorePath: ['/auth/login', '/auth/signup', ...]
  }
  localStorage: { sentEmailToOtp: 'temp-to' }
  auth: {
    afterLoginUrl: '/dashboard',
    afterSignupUrl: '/auth/signup/complete',
    afterSignoutUrl: '/auth/login'
  }
  locale: { default: 'en', supported: ['en', 'th'] }
}
```

### `service.config.ts`

Central map of all backend API paths:

```typescript
// Unauthenticated
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot/mail
POST   /api/v1/auth/refresh
POST   /api/v1/auth/verify/mail
PATCH  /api/v1/auth/verify/mail
POST   /api/v1/auth/password
POST   /api/v1/auth/request-access
POST   /api/v1/auth/signup/request-access
POST   /api/v1/auth/oauth

// Authenticated
POST   /api/v1/auth/logout
GET    /api/v1/auth-session
DELETE /api/v1/auth-session/deactivate/:id
GET    /api/v1/account
PATCH  /api/v1/account
GET    /api/v1/account/setting/basic
PATCH  /api/v1/account/setting/basic
GET    /api/v1/workspace
POST   /api/v1/workspace
PATCH  /api/v1/workspace/:id
```

### `toggle.config.ts`

Feature flags for enabling/disabling functionality in the UI.

---

## Design System

**Tailwind v4** with CSS custom properties in `styles/globals.css`. Colors use oklch format.

| Variable | Light | Dark |
|----------|-------|------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |

Radius scale: `--radius: 0.625rem` → `radius-sm`, `radius-md` (`radius-2`), `radius-lg` (`radius`), `radius-xl`, `radius-2xl`, `radius-3xl`, `radius-4xl`.

Dark mode: `class="dark"` strategy on `<html>`, toggled by `next-themes`.

**shadcn/ui:** 54 components in `components/ui/` — do not edit these files directly. Add new components via `pnpm shadcn add <name>`.

---

## NextAuth Configuration (`auth.ts`)

**Providers:** Google, GitHub, Facebook

**JWT callback** (on first OAuth sign-in):
1. Calls `POST /api/v1/auth/oauth` with `{ provider, providerId, email, displayName, image }`
2. Stores `accessToken`, `refreshToken`, and `account` info in NextAuth JWT

**Session callback:**
- Populates `session.accessToken`, `session.refreshToken`, and `session.user`

Used only for OAuth flows. Email/password auth uses the custom cookie-based session (`lib/session.ts`) instead.

---

## Form Validation

Forms use **React Hook Form** + **Zod** schemas:

```typescript
// Example: signup
const schema = z.object({
  displayName: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,64}$/)
})
```

Password validation regex enforces: uppercase, lowercase, digit, special character, 8–64 chars.

---

## Internationalization

Supported locales: `en` (English), `th` (Thai).

- Language stored in cookie / account setting
- Thai date locale at `lib/date/locales/th.ts`
- `use-language.hook.ts` reads + writes locale preference

---

## Environment Variables Reference

```bash
# Next.js public
NEXT_PUBLIC_SERVICE_URL=http://localhost:3030

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

See `web/.env.local` for local values (not committed).
