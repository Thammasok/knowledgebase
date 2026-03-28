import { notFound } from 'next/navigation'
import { PageEditor } from './page-editor'
import { getSession } from '@/lib/session'

interface PageRouteProps {
  params: Promise<{ pageId: string }>
  searchParams: Promise<{ ws?: string }>
}

async function fetchPage(workspaceId: string, pageId: string, accessToken: string) {
  const serviceUrl = process.env.NEXT_PUBLIC_SERVICE_URL ?? 'http://localhost:3030'
  const res = await fetch(
    `${serviceUrl}/api/v1/workspace/${workspaceId}/page/${pageId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      // No cache — content updates frequently
      cache: 'no-store',
    },
  )
  if (!res.ok) return null
  return res.json()
}

export default async function PageRoute({ params, searchParams }: PageRouteProps) {
  const { pageId } = await params
  const { ws: workspaceId } = await searchParams

  if (!workspaceId) notFound()

  const session = await getSession()
  if (!session) notFound()

  const page = await fetchPage(workspaceId, pageId, session.token.accessToken)
  if (!page) notFound()

  return (
    <div className="h-full">
      <PageEditor
        page={{
          id: page.id,
          title: page.title,
          content: Array.isArray(page.content) ? page.content : [],
          workspaceId,
        }}
      />
    </div>
  )
}
