# Middleware / Proxy (Context7)

Source: [Next.js Official Docs via Context7](https://context7.com/vercel/next.js)

> **Next.js 16 Note**: `middleware.ts` has been renamed to `proxy.ts`. The examples below use the new naming convention.

## Overview

The Proxy (formerly Middleware) runs before a request is completed. It can:
- Redirect or rewrite requests
- Modify request/response headers
- Return responses directly
- Implement authentication checks

## Basic Setup

Create `proxy.ts` (or `proxy.js`) in your project root (same level as `app/` or `pages/`).

### Simple Redirect

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

## Authentication Pattern

### Basic Auth Check

```typescript
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function proxy(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  if (isAuthenticated) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

### Protected Routes with Session

```tsx
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // Decrypt session from cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // Redirect to /login if not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect authenticated users away from public routes
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

### API Authentication

```typescript
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'

export const config = {
  matcher: '/api/:function*',
}

export function proxy(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
  // Continue to API route if authenticated
}
```

## Conditional Rewrites

```ts
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  const nextUrl = request.nextUrl

  if (nextUrl.pathname === '/dashboard') {
    if (request.cookies.authToken) {
      return NextResponse.rewrite(new URL('/auth/dashboard', request.url))
    } else {
      return NextResponse.rewrite(new URL('/public/dashboard', request.url))
    }
  }
}
```

## Matcher Configuration

### Basic Patterns

```javascript
export const config = {
  matcher: '/about/:path*',           // Single path pattern
}

export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],  // Multiple patterns
}
```

### Exclude Static Assets

```javascript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

### Advanced Matching with Conditions

```javascript
export const config = {
  matcher: [
    {
      source: '/api/:path*',
      locale: false,
      has: [
        { type: 'header', key: 'Authorization', value: 'Bearer Token' },
        { type: 'query', key: 'userId', value: '123' },
      ],
      missing: [{ type: 'cookie', key: 'session', value: 'active' }],
    },
  ],
}
```

## NextResponse Methods

| Method | Description |
|--------|-------------|
| `NextResponse.next()` | Continue to the route |
| `NextResponse.redirect(url)` | Redirect to another URL |
| `NextResponse.rewrite(url)` | Rewrite to a different URL (URL stays same) |
| `Response.json(data, init)` | Return JSON response directly |

## Best Practices

1. **Keep it lightweight** - Proxy runs on every matched request
2. **Use matchers** - Exclude static assets and API routes when not needed
3. **Avoid heavy operations** - No database queries; use edge-compatible code
4. **Handle errors gracefully** - Always return a response

## Config in next.config.js

For simpler cases, use `rewrites` and `redirects` in `next.config.js`:

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/docs/:slug*',
        destination: '/docs/md/:slug*',
        has: [
          { type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
}
```
