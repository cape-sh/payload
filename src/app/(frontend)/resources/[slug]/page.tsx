import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/metadata'
import { ArticleHeader } from '@/components/article/ArticleHeader'
import { ArticleBody } from '@/components/article/ArticleBody'
import { TableOfContents } from '@/components/article/TableOfContents'
import { RelatedPosts } from '@/components/article/RelatedPosts'
import { SocialShare } from '@/components/article/SocialShare'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const article = result.docs[0]
  if (!article) return { title: 'Not Found' }
  return buildMetadata(article, '/resources')
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'resources',
    where: { _status: { equals: 'published' } },
    limit: 100,
  })

  return result.docs.map((doc) => ({ slug: doc.slug }))
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'resources',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const article = result.docs[0]
  if (!article) notFound()

  // Extract headings from Lexical content for ToC
  const headings = extractHeadings(article.content)

  // Get related posts
  const relatedIds = article.related_posts as number[] | undefined
  let relatedPosts: any[] = []

  if (relatedIds && relatedIds.length > 0) {
    const related = await payload.find({
      collection: 'resources',
      where: { id: { in: relatedIds.map(String).join(',') } },
      limit: 3,
    })
    relatedPosts = related.docs
  } else {
    // Fallback: 3 most recent articles sharing first tag
    const firstTag = (article.tags as { tag: string }[] | undefined)?.[0]?.tag
    const fallback = await payload.find({
      collection: 'resources',
      where: {
        _status: { equals: 'published' },
        id: { not_equals: article.id },
        ...(firstTag ? { 'tags.tag': { contains: firstTag } } : {}),
      },
      limit: 3,
      sort: '-publish_date',
    })
    relatedPosts = fallback.docs
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://caepe.sh'
  const articleUrl = `${siteUrl}/resources/${article.slug}`
  const featureImageObj =
    article.feature_image && typeof article.feature_image === 'object'
      ? article.feature_image
      : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || '',
    url: articleUrl,
    datePublished: article.publish_date || undefined,
    author: article.author ? { '@type': 'Person', name: article.author } : undefined,
    publisher: { '@type': 'Organization', name: 'CAEPE' },
    ...(featureImageObj?.url ? { image: featureImageObj.url } : {}),
  }

  return (
    <article data-pagefind-body className="px-6 py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl">
        <ArticleHeader
          title={article.title}
          author={article.author}
          publishDate={article.publish_date}
          readingTime={article.reading_time}
          tags={article.tags as { tag: string }[] | undefined}
          featureImage={article.feature_image as any}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_250px]">
          <div>
            <ArticleBody content={article.content} />
            <SocialShare url={articleUrl} title={article.title} />
          </div>

          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>

        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
      </div>
    </article>
  )
}

interface Heading {
  id: string
  text: string
  level: number
}

function extractHeadings(content: any): Heading[] {
  const headings: Heading[] = []
  if (!content?.root?.children) return headings

  function walk(nodes: any[]) {
    for (const node of nodes) {
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
        const text = getTextFromNode(node)
        if (text) {
          headings.push({
            id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            text,
            level: node.tag === 'h2' ? 2 : 3,
          })
        }
      }
      if (node.children) walk(node.children)
    }
  }

  walk(content.root.children)
  return headings
}

function getTextFromNode(node: any): string {
  if (node.text) return node.text
  if (node.children) return node.children.map(getTextFromNode).join('')
  return ''
}
