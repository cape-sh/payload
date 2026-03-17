import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/metadata'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'test-drive' } },
    limit: 1,
  })
  const page = result.docs[0]
  if (!page) return { title: 'Test Drive — CAEPE' }
  return buildMetadata(page)
}

export default async function TestDrivePage() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'test-drive' } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-accent-light">Page not found.</p>
      </div>
    )
  }

  const layout = (page.layout ?? []) as any[]

  return <BlockRenderer blocks={layout} />
}
