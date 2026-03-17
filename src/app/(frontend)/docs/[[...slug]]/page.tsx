import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDoc } from '@/lib/docs/get-doc'
import { getAllSlugs } from '@/lib/docs/get-all-slugs'
import { renderMarkdown } from '@/components/docs/MarkdownRenderer'
import { DocsLayout } from '@/components/docs/DocsLayout'
import { DocsTableOfContents } from '@/components/docs/DocsTableOfContents'
import { DocsBreadcrumb } from '@/components/docs/DocsBreadcrumb'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug: slug.length === 0 ? undefined : slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugParts = slug || []
  const doc = getDoc(slugParts)
  if (!doc) return {}

  const title = doc.meta.title || extractFirstH1(doc.content) || 'CAEPE Docs'
  const description = doc.meta.description || `CAEPE documentation — ${title}`

  return {
    title: `${title} — CAEPE Docs`,
    description,
    openGraph: {
      title: `${title} — CAEPE Docs`,
      description,
      type: 'article',
    },
  }
}

function extractFirstH1(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params
  const slugParts = slug || []
  const doc = getDoc(slugParts)

  if (!doc) notFound()

  const { html, headings } = await renderMarkdown(doc.content)
  const slugStr = slugParts.join('/')

  return (
    <DocsLayout
      toc={headings.length > 1 ? <DocsTableOfContents headings={headings} /> : undefined}
    >
      <DocsBreadcrumb slug={slugStr} />
      <article
        className="docs-prose prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </DocsLayout>
  )
}
