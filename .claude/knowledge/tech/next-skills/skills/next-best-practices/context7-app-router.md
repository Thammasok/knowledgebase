# App Router Fundamentals (Context7)

Source: [Next.js Official Docs via Context7](https://context7.com/vercel/next.js)

## Overview

The **App Router** is a file-system based router built on React Server Components. Introduced in Next.js 13, it supports:
- Layouts and nested routing
- Loading states
- Error handling
- Server Components, Suspense, and Server Functions

## Server Components

Server Components are the default in the App Router. They fetch data asynchronously and can pass data to Client Components.

### Basic Server Component with Data Fetching

```tsx
// app/[id]/page.tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

### Data Fetching Pattern (Replaces getServerSideProps/getStaticProps)

```tsx
// app/page.tsx
import HomePage from './home-page'

async function getPosts() {
  const res = await fetch('https://...')
  const posts = await res.json()
  return posts
}

export default async function Page() {
  // Fetch data directly in a Server Component
  const recentPosts = await getPosts()
  // Forward fetched data to your Client Component
  return <HomePage recentPosts={recentPosts} />
}
```

**Key differences from Pages Router:**
- No `getServerSideProps` or `getStaticProps`
- Use `async/await` directly in the component
- Data fetching happens at the component level

## Client Components

Client Components use the `'use client'` directive. They:
- Have access to state and effects
- Can use browser APIs
- Are prerendered on the server during initial page load

```tsx
'use client'

// This is a Client Component (same as components in the `pages` directory)
// It receives data as props, has access to state and effects, and is
// prerendered on the server during the initial page load.
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## Server vs Client Component Decision

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Data fetching | Direct async/await | Via props or useEffect |
| State (useState) | No | Yes |
| Effects (useEffect) | No | Yes |
| Browser APIs | No | Yes |
| Secrets/env vars | Safe | Exposed if used |
| Bundle size | Not included | Included |

## Quick Reference

- **Default**: All components are Server Components unless marked with `'use client'`
- **Data flow**: Server Components fetch data, pass to Client Components as props
- **Async params**: In Next.js 15+, `params` and `searchParams` are Promises
- **No API layer needed**: Server Components can access databases directly
