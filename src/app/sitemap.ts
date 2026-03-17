import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://caepe.sh'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()

  const pages = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 100,
  })

  const resources = await payload.find({
    collection: 'resources',
    where: { _status: { equals: 'published' } },
    limit: 100,
  })

  const pageEntries: MetadataRoute.Sitemap = pages.docs.map((page) => ({
    url: `${SITE_URL}/${page.slug === 'home' ? '' : page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: page.slug === 'home' ? 1.0 : 0.8,
  }))

  const resourceEntries: MetadataRoute.Sitemap = resources.docs.map((resource) => ({
    url: `${SITE_URL}/resources/${resource.slug}`,
    lastModified: resource.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...pageEntries,
    ...resourceEntries,
  ]
}
