import type { Metadata } from 'next'
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

  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return { title: 'Page Not Found — CAEPE' }
  return buildMetadata(page)
}

export default async function DynamicPage({ params }: { params: Params }) {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) return notFound()

  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return notFound()

  const layout = (page.layout ?? []) as any[]
  return <BlockRenderer blocks={layout} />
}
