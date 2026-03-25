# Caching Strategies (Context7)

Source: [Next.js Official Docs via Context7](https://context7.com/vercel/next.js)

## Overview

Next.js provides multiple caching mechanisms:
- **Fetch cache** - Cache individual fetch requests
- **unstable_cache** - Cache non-fetch async functions (database queries, etc.)
- **Time-based revalidation** - Automatically refresh cache after N seconds
- **On-demand revalidation** - Manually invalidate with tags

## Fetch Request Caching

### Static Data (Default)

```tsx
export default async function Page() {
  // Cached until manually invalidated (like getStaticProps)
  // `force-cache` is the default and can be omitted
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

### Dynamic Data (No Cache)

```tsx
export default async function Page() {
  // Refetched on every request (like getServerSideProps)
  const data = await fetch('https://...', { cache: 'no-store' })
}
```

### Time-Based Revalidation

```tsx
export default async function Page() {
  // Cached for 10 seconds, then revalidated
  const data = await fetch('https://...', { next: { revalidate: 10 } })
}
```

```tsx
export default async function Page() {
  // Revalidate every hour (3600 seconds)
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

## Caching Non-Fetch Functions (unstable_cache)

Use `unstable_cache` for database queries or other async operations that don't use fetch.

### Basic Usage

```ts
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getCachedUser = unstable_cache(
  async (id: string) => {
    return db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])
  },
  ['user'], // cache key prefix
  {
    tags: ['user'],      // for on-demand revalidation
    revalidate: 3600,    // time-based revalidation (seconds)
  }
)
```

### Dynamic Cache Keys

Include dynamic values in the cache key:

```tsx
import { unstable_cache } from 'next/cache'

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const getCachedUser = unstable_cache(
    async () => {
      return { id: userId }
    },
    [userId], // dynamic cache key includes userId
    {
      tags: ['users'],
      revalidate: 60,
    }
  )

  const user = await getCachedUser()
  // ...
}
```

## Cache Invalidation

### Tag-Based Revalidation

```ts
// In your data function
export const getPost = unstable_cache(
  async (id: string) => db.post.findUnique({ where: { id } }),
  ['post'],
  { tags: ['posts', `post-${id}`] }
)

// In a Server Action or Route Handler
import { revalidateTag } from 'next/cache'

export async function updatePost(id: string, data: PostData) {
  await db.post.update({ where: { id }, data })
  revalidateTag('posts')        // Invalidate all posts
  revalidateTag(`post-${id}`)   // Or invalidate specific post
}
```

### Path-Based Revalidation

```ts
import { revalidatePath } from 'next/cache'

export async function createPost(data: PostData) {
  await db.post.create({ data })
  revalidatePath('/posts')  // Revalidate the posts page
}
```

## Migration from Pages Router

| Pages Router | App Router Equivalent |
|--------------|----------------------|
| `getStaticProps` | `fetch()` with `cache: 'force-cache'` (default) |
| `getServerSideProps` | `fetch()` with `cache: 'no-store'` |
| `getStaticProps` + `revalidate` | `fetch()` with `next: { revalidate: N }` |
| `getStaticPaths` | `generateStaticParams()` |

## Quick Reference

| Caching Method | Use Case | Revalidation |
|----------------|----------|--------------|
| `fetch` default | External API calls | Manual or time-based |
| `cache: 'no-store'` | Always fresh data | Every request |
| `next: { revalidate: N }` | Periodic refresh | After N seconds |
| `unstable_cache` | Database queries, non-fetch | Tags or time-based |
| `revalidateTag()` | On-demand invalidation | Immediate |
| `revalidatePath()` | Page-level invalidation | Immediate |
