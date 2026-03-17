import { getPayload } from '@/lib/payload'
import { ResourceCard } from '@/components/resources/ResourceCard'
import { TagFilter } from '@/components/resources/TagFilter'
import { Pagination } from '@/components/resources/Pagination'
import type { Metadata } from 'next'
import type { Where } from 'payload'

export const metadata: Metadata = {
  title: 'Resources — CAEPE',
  description: 'Articles, guides, and resources on Kubernetes management, deployment, and DevOps.',
}

interface Props {
  searchParams: Promise<{ tag?: string; page?: string }>
}

export default async function ResourcesPage({ searchParams }: Props) {
  const params = await searchParams
  const tag = params.tag
  const currentPage = parseInt(params.page || '1', 10)

  const payload = await getPayload()

  // Build where clause
  const where: Where = { _status: { equals: 'published' } }
  if (tag) {
    where['tags.tag'] = { contains: tag }
  }

  const result = await payload.find({
    collection: 'resources',
    where,
    limit: 12,
    page: currentPage,
    sort: '-publish_date',
  })

  // Get all unique tags for the filter
  const allResources = await payload.find({
    collection: 'resources',
    where: { _status: { equals: 'published' } },
    limit: 0,
  })

  const allTags = new Set<string>()
  for (const doc of allResources.docs) {
    const tags = doc.tags as { tag: string }[] | undefined
    if (tags) {
      for (const t of tags) {
        if (t.tag) allTags.add(t.tag)
      }
    }
  }

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Resources</h1>
          <p className="mt-4 text-lg text-accent-light">
            Articles, guides, and insights on Kubernetes management and deployment.
          </p>
        </div>

        <TagFilter tags={Array.from(allTags).sort()} activeTag={tag} />

        {result.docs.length === 0 ? (
          <p className="py-12 text-center text-accent-light">No resources found.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((doc) => (
              <ResourceCard key={doc.id} resource={doc} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={result.page ?? 1}
          totalPages={result.totalPages}
          hasNextPage={result.hasNextPage}
          hasPrevPage={result.hasPrevPage}
          baseUrl={tag ? `/resources?tag=${encodeURIComponent(tag)}` : '/resources'}
        />
      </div>
    </section>
  )
}
