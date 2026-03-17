import type { Metadata } from 'next'

interface MetaSource {
  title: string
  slug: string
  meta?: {
    meta_title?: string | null
    meta_description?: string | null
    og_image?: { url?: string | null } | number | null
  } | null
  excerpt?: string | null
  feature_image?: { url?: string | null } | number | null
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://caepe.sh'

export function buildMetadata(doc: MetaSource, pathPrefix = ''): Metadata {
  const title = doc.meta?.meta_title || `${doc.title} — CAEPE`
  const description = doc.meta?.meta_description || doc.excerpt || ''
  const slug = doc.slug === 'home' ? '' : doc.slug
  const canonical = `${SITE_URL}${pathPrefix}/${slug}`.replace(/\/$/, '')

  const ogImage =
    doc.meta?.og_image && typeof doc.meta.og_image === 'object'
      ? doc.meta.og_image.url
      : doc.feature_image && typeof doc.feature_image === 'object'
        ? doc.feature_image.url
        : null

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'CAEPE',
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}
