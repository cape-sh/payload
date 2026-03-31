import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/metadata'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

// Slugs that have dedicated hardcoded routes — skip them here
const RESERVED_SLUGS = new Set([
  'home',
  'features',
  'pricing',
  'test-drive',
  'resources',
  'docs',
])

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 100,
    select: { slug: true },
  })

  return result.docs
    .filter((doc) => !RESERVED_SLUGS.has(doc.slug))
    .map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) return notFound()

  const { isEnabled: isDraft } = await draftMode()

  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft: isDraft,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return { title: 'Page Not Found — CAEPE' }
  return buildMetadata(page)
}

export default async function DynamicPage({ params }: { params: Params }) {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) return notFound()

  const { isEnabled: isDraft } = await draftMode()

  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    draft: isDraft,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return notFound()

  const layout = (page.layout ?? []) as any[]

  return (
    <>
      {isDraft && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black shadow-lg">
          Draft Preview
          <a
            href={`/api/exit-preview?path=/${slug}`}
            className="rounded bg-black/20 px-2 py-1 text-xs hover:bg-black/30"
          >
            Exit
          </a>
        </div>
      )}
      <BlockRenderer blocks={layout} />
    </>
  )
}
