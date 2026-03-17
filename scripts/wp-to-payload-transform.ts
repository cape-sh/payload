/**
 * WP → Payload Transform
 * Transforms exported WP JSON into Payload-ready seed data.
 *
 * Usage: npx tsx scripts/wp-to-payload-transform.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const WP_DIR = join(process.cwd(), 'migration', 'wp-export')
const OUTPUT_FILE = join(WP_DIR, 'payload-seed-data.json')

function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).replace(/\s+\S*$/, '') + '...'
}

interface WPCategory {
  id: number
  name: string
  slug: string
}

interface WPTag {
  id: number
  name: string
  slug: string
}

function loadJSON(filename: string) {
  const path = join(WP_DIR, filename)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function buildCategoryMap(categories: WPCategory[]): Map<number, string> {
  const map = new Map<number, string>()
  for (const cat of categories) {
    map.set(cat.id, cat.name)
  }
  return map
}

function buildTagMap(tags: WPTag[]): Map<number, string> {
  const map = new Map<number, string>()
  for (const tag of tags) {
    map.set(tag.id, tag.name)
  }
  return map
}

/**
 * Convert HTML to a simple Lexical root node with paragraph children.
 * This is a minimal conversion — Lexical uses a JSON AST.
 * For the pilot, we extract text paragraphs from HTML.
 */
function htmlToLexical(html: string) {
  // Extract text blocks by splitting on block-level tags
  const blocks = html
    .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, '') // Remove style/script
    .replace(/<br\s*\/?>/gi, '\n')
    .split(/<\/(?:p|div|h[1-6]|li|blockquote)>/gi)
    .map((block) => stripHTML(block))
    .filter((text) => text.length > 0)

  const children = blocks.map((text) => ({
    type: 'paragraph',
    children: [{ type: 'text', text, version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }))

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function transformPilotPages() {
  const pages = []

  // Features page
  const features = loadJSON('page-features.json')
  if (features) {
    pages.push({
      title: stripHTML(features.title.rendered),
      slug: 'features',
      meta: {
        meta_title: 'CAEPE Features — Enterprise Kubernetes Deployment Platform',
        meta_description:
          'Explore CAEPE features: deployment strategies, smoke testing, edge/air-gapped support, and multi-cluster management for Kubernetes.',
      },
      _status: 'draft',
    })
    console.log(`  → Features page transformed`)
  }

  // Pricing page
  const pricing = loadJSON('page-pricing.json')
  if (pricing) {
    pages.push({
      title: stripHTML(pricing.title.rendered),
      slug: 'pricing',
      meta: {
        meta_title: 'CAEPE Pricing — Simple, Transparent Kubernetes Deployment Pricing',
        meta_description:
          'CAEPE pricing starts at $500/cluster/month for up to 25 clusters. All plans include enterprise support, unlimited apps, RBAC/SSO, and DORA metrics.',
      },
      _status: 'draft',
    })
    console.log(`  → Pricing page transformed`)
  }

  // Test Drive page
  const testDrive = loadJSON('page-caepe-test-drive.json')
  if (testDrive) {
    pages.push({
      title: stripHTML(testDrive.title.rendered),
      slug: 'test-drive',
      meta: {
        meta_title: 'CAEPE Test Drive — Try Kubernetes Deployment Free',
        meta_description:
          'Experience CAEPE for free. Secure sandbox, no credit card required. Built-in progressive delivery, pre-flight tests, and CI tool integration.',
      },
      _status: 'draft',
    })
    console.log(`  → Test Drive page transformed`)
  }

  // Resources page
  const resources = loadJSON('page-resources.json')
  if (resources) {
    pages.push({
      title: stripHTML(resources.title.rendered),
      slug: 'resources',
      meta: {
        meta_title: 'CAEPE Resources — Articles, Guides & Case Studies',
        meta_description:
          'DevOps resources covering continuous deployment, Kubernetes operations, deployment strategies, and infrastructure management best practices.',
      },
      _status: 'draft',
    })
    console.log(`  → Resources page transformed`)
  }

  return pages
}

function transformPilotArticle() {
  const categories = loadJSON('categories.json') || []
  const tags = loadJSON('tags.json') || []
  const categoryMap = buildCategoryMap(categories)
  const tagMap = buildTagMap(tags)
  const posts = loadJSON('posts.json') || []

  if (posts.length === 0) return []

  // Use the most recent post as the pilot article
  const post = posts[0]
  const content = post.content?.rendered || ''

  const articleTags: string[] = []
  for (const catId of post.categories || []) {
    const name = categoryMap.get(catId)
    if (name && name !== 'Uncategorized') articleTags.push(name)
  }
  for (const tagId of post.tags || []) {
    const name = tagMap.get(tagId)
    if (name) articleTags.push(name)
  }

  const article = {
    title: stripHTML(post.title.rendered),
    slug: post.slug,
    excerpt: truncate(stripHTML(post.excerpt?.rendered || ''), 250),
    content: htmlToLexical(content),
    author: 'CAEPE Team',
    publish_date: post.date ? new Date(post.date).toISOString().split('T')[0] : undefined,
    reading_time: Math.max(3, Math.ceil(stripHTML(content).split(/\s+/).length / 200)),
    tags: articleTags.map((tag) => ({ tag })),
    meta: {
      meta_title: stripHTML(post.title.rendered),
      meta_description: truncate(stripHTML(post.excerpt?.rendered || ''), 160),
    },
    featured_media_url: null as string | null,
    featured_media_alt: null as string | null,
    _status: 'draft',
  }

  // Try to get featured media URL
  if (post.featured_media) {
    const mediaData = loadJSON(`media-${post.featured_media}.json`)
    if (mediaData) {
      article.featured_media_url = mediaData.source_url
      article.featured_media_alt = mediaData.alt_text || stripHTML(mediaData.title.rendered)
    }
  }

  console.log(`  → Article transformed: "${article.title}" (${article.reading_time} min read, ${articleTags.length} tags)`)
  return [article]
}

function main() {
  console.log('Transforming WP data → Payload seed format...\n')

  const pages = transformPilotPages()
  const articles = transformPilotArticle()

  const seedData = { pages, articles }
  writeFileSync(OUTPUT_FILE, JSON.stringify(seedData, null, 2))

  console.log(`\nSeed data written to: ${OUTPUT_FILE}`)
  console.log(`  Pages: ${pages.length}`)
  console.log(`  Articles: ${articles.length}`)
}

main()
