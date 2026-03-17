import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/metadata'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) {
    return {
      title: 'CAEPE — Streamline Kubernetes Continuous Deployment',
      description: 'CAEPE extends GitOps and simplifies deployment for all skill levels.',
    }
  }
  return buildMetadata(page)
}

export default async function HomePage() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-accent-light">Homepage not found. Seed the home page in Payload admin.</p>
      </div>
    )
  }

  const layout = (page.layout ?? []) as any[]
  return <BlockRenderer blocks={layout} />
}
