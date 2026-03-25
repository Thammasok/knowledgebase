# Route Handlers (Context7)

Source: [Next.js Official Docs via Context7](https://context7.com/vercel/next.js)

## Overview

Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs. They replace API Routes from the Pages Router.

**File:** `app/api/[...]/route.ts`

## Basic Setup

### All HTTP Methods

```typescript
// app/api/posts/route.ts
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// OPTIONS is auto-implemented if not defined
export async function OPTIONS(request: Request) {}
```

## Common Patterns

### GET - Fetch Data

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await db.post.findMany()
  return NextResponse.json(posts)
}
```

### POST - Create Data

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await db.post.create({ data: body })
  return NextResponse.json(post, { status: 201 })
}
```

### With Query Parameters

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  // Use query...
  return NextResponse.json({ results: [] })
}
```

## Dynamic Route Segments

Access dynamic parameters via the second argument. In Next.js 15+, `params` is a Promise.

```typescript
// app/api/posts/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const post = await db.post.findUnique({ where: { id } })

  if (!post) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  return Response.json(post)
}
```

### Before/After Next.js 15

```typescript
// Before Next.js 15
export async function GET(request: Request, segmentData: { params: Params }) {
  const params = segmentData.params  // Direct access
  const slug = params.slug
}

// After Next.js 15
export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params  // Must await
  const slug = params.slug
}
```

## Static Route Handlers

Use `generateStaticParams` to pre-render Route Handlers at build time:

```typescript
// app/api/posts/[id]/route.ts
export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )

  return posts.map((post: { id: number }) => ({
    id: `${post.id}`,
  }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const res = await fetch(`https://api.vercel.app/blog/${id}`)

  if (!res.ok) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  const post = await res.json()
  return Response.json(post)
}
```

## Redirect Lookup Pattern

Route Handler for looking up redirects (useful with middleware):

```typescript
// app/api/redirects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')

  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }

  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]

  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }

  return NextResponse.json(redirect)
}
```

## Response Methods

### Using NextResponse

```typescript
import { NextResponse } from 'next/server'

// JSON response
return NextResponse.json({ data: 'value' })

// With status code
return NextResponse.json({ error: 'Not found' }, { status: 404 })

// Redirect
return NextResponse.redirect(new URL('/home', request.url))

// Rewrite (URL stays same)
return NextResponse.rewrite(new URL('/api/v2/posts', request.url))

// With headers
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'max-age=3600' }
})
```

### Using Web Response API

```typescript
// Plain text
return new Response('Hello World')

// JSON
return Response.json({ data: 'value' })

// With status
return Response.json({ error: 'Unauthorized' }, { status: 401 })

// Custom headers
return new Response(body, {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=31536000',
  },
})
```

## Caching Behavior

| Condition | Caching |
|-----------|---------|
| GET with no dynamic functions | Cached (static) |
| GET with `cookies()`, `headers()` | Not cached (dynamic) |
| POST, PUT, DELETE, PATCH | Never cached |
| Using `request` object | Not cached |

### Force Dynamic

```typescript
export const dynamic = 'force-dynamic'

export async function GET() {
  // Always runs at request time
}
```

### Revalidate

```typescript
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // Cached and revalidated
}
```

## When to Use Route Handlers

| Use Case | Solution |
|----------|----------|
| Internal data fetching | Server Components (not Route Handlers) |
| Form mutations | Server Actions |
| External API access | Route Handlers |
| Webhooks | Route Handlers |
| Mobile app backend | Route Handlers |
| OpenAPI/Swagger docs | Route Handlers |

## Quick Reference

```
app/
├── api/
│   ├── posts/
│   │   ├── route.ts          # /api/posts (GET, POST)
│   │   └── [id]/
│   │       └── route.ts      # /api/posts/:id (GET, PUT, DELETE)
│   └── webhooks/
│       └── stripe/
│           └── route.ts      # /api/webhooks/stripe (POST)
```
