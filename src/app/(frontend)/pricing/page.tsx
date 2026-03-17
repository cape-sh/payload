import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/metadata'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'pricing' } },
    limit: 1,
    draft: false,
  })

  const page = result.docs[0]
  if (!page) return { title: 'Pricing — CAEPE' }
  return buildMetadata(page)
}

export default async function PricingPage() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'pricing' } },
    limit: 1,
    draft: true,
  })

  const page = result.docs[0]
  if (!page) return <div className="p-12 text-center">Page not found</div>

  const blocks = (page.layout ?? []) as any[]

  return <BlockRenderer blocks={blocks} />
}
