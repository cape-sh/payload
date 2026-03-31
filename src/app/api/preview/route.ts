import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  const collection = req.nextUrl.searchParams.get('collection') || 'pages'
  const secret = req.nextUrl.searchParams.get('secret')

  // Verify the preview secret
  if (secret !== process.env.PAYLOAD_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  // Verify the page exists
  const payload = await getPayload()
  const result = await payload.find({
    collection: collection as 'pages' | 'resources',
    where: { slug: { equals: slug } },
    draft: true,
    limit: 1,
  })

  if (!result.docs.length) {
    return new Response('Page not found', { status: 404 })
  }

  // Enable Draft Mode
  const draft = await draftMode()
  draft.enable()

  // Redirect to the page
  if (collection === 'resources') {
    redirect(`/resources/${slug}`)
  }

  if (slug === 'home') {
    redirect('/')
  }

  redirect(`/${slug}`)
}
