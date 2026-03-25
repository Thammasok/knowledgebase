# Metadata API (Context7)

Source: [Next.js Official Docs via Context7](https://context7.com/vercel/next.js)

## Overview

Next.js provides a Metadata API for defining SEO and social sharing metadata:
- **Static metadata** - Export a `metadata` object
- **Dynamic metadata** - Export a `generateMetadata` function
- **File-based metadata** - Convention files like `opengraph-image.tsx`

## Static Metadata

Export a `metadata` object from a `layout.tsx` or `page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A blog about web development',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Dynamic Metadata

Use `generateMetadata` for routes where metadata depends on dynamic data:

```tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug

  // Fetch data for metadata
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params, searchParams }: Props) {
  // ...
}
```

## Open Graph Metadata

Configure social sharing with the `openGraph` property:

```tsx
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png', // Must be absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png',
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

**Generated HTML:**
```html
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:url" content="https://nextjs.org/" />
<meta property="og:site_name" content="Next.js" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://nextjs.org/og.png" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="600" />
<meta property="og:type" content="website" />
```

## Twitter Card Metadata

```tsx
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'], // Must be absolute URL
  },
}
```

## Dynamic OG Image Generation

Create `opengraph-image.tsx` in your route folder:

```tsx
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

// Image metadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

### With Custom Fonts

```tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'About Acme'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const interSemiBold = await readFile(
    join(process.cwd(), 'assets/Inter-SemiBold.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

## ImageResponse Options

```tsx
new ImageResponse(element, {
  width: 1200,           // Default: 1200
  height: 630,           // Default: 630
  emoji: 'twemoji',      // 'twemoji' | 'blobmoji' | 'noto' | 'openmoji'
  fonts: [],             // Array of custom font definitions
  debug: false,          // Enable debug mode
  status: 200,           // HTTP status code
  headers: {},           // Additional HTTP headers
})
```

## File-Based Metadata Conventions

| File | Purpose |
|------|---------|
| `opengraph-image.tsx` | OG image generation |
| `twitter-image.tsx` | Twitter card image |
| `icon.tsx` | Favicon generation |
| `apple-icon.tsx` | Apple touch icon |
| `sitemap.ts` | XML sitemap |
| `robots.ts` | robots.txt |

## Metadata Inheritance

Metadata defined in parent layouts is inherited by child routes:

```tsx
// app/layout.tsx - Base metadata
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}

// app/blog/page.tsx - Overrides parent
export const metadata = {
  title: 'Blog | Acme',  // Overrides parent title
  // openGraph inherited from parent
}
```

## Quick Reference

| Feature | Static | Dynamic |
|---------|--------|---------|
| Syntax | `export const metadata = {}` | `export async function generateMetadata()` |
| Data fetching | No | Yes |
| Route params | No | Yes (`params`) |
| Search params | No | Yes (`searchParams`) |
| Parent metadata | No | Yes (`parent` argument) |
