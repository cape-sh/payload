/**
 * WP Export Script
 * Fetches content from caepe.sh WordPress REST API and saves to migration/wp-export/
 *
 * Usage: npx tsx scripts/wp-export.ts
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const WP_BASE = 'https://caepe.sh/wp-json/wp/v2'
const OUTPUT_DIR = join(process.cwd(), 'migration', 'wp-export')

async function fetchJSON(endpoint: string) {
  const url = `${WP_BASE}/${endpoint}`
  console.log(`Fetching: ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  // Fetch all content types in parallel
  const [pages, posts, categories, tags, media] = await Promise.all([
    fetchJSON('pages?per_page=100'),
    fetchJSON('posts?per_page=100'),
    fetchJSON('categories?per_page=100'),
    fetchJSON('tags?per_page=100'),
    fetchJSON('media?per_page=100'),
  ])

  // Save each to file
  const exports = { pages, posts, categories, tags, media }
  for (const [name, data] of Object.entries(exports)) {
    const filePath = join(OUTPUT_DIR, `${name}.json`)
    writeFileSync(filePath, JSON.stringify(data, null, 2))
    console.log(`  → ${name}.json: ${(data as unknown[]).length} records`)
  }

  // Also fetch pilot-specific pages individually for full content
  const pilotSlugs = ['features', 'pricing', 'caepe-test-drive', 'resources']
  for (const slug of pilotSlugs) {
    const page = await fetchJSON(`pages?slug=${slug}`)
    if (page.length > 0) {
      const filePath = join(OUTPUT_DIR, `page-${slug}.json`)
      writeFileSync(filePath, JSON.stringify(page[0], null, 2))
      console.log(`  → page-${slug}.json: "${page[0].title.rendered}"`)
    } else {
      console.log(`  ⚠ No page found for slug: ${slug}`)
    }
  }

  // Fetch the pilot article (most recent post)
  const pilotArticle = posts[0]
  if (pilotArticle) {
    const fullPost = await fetchJSON(`posts/${pilotArticle.id}`)
    writeFileSync(join(OUTPUT_DIR, `post-${pilotArticle.slug}.json`), JSON.stringify(fullPost, null, 2))
    console.log(`  → post-${pilotArticle.slug}.json: "${pilotArticle.title.rendered}"`)

    // Fetch featured image if present
    if (pilotArticle.featured_media) {
      const mediaItem = await fetchJSON(`media/${pilotArticle.featured_media}`)
      writeFileSync(join(OUTPUT_DIR, `media-${pilotArticle.featured_media}.json`), JSON.stringify(mediaItem, null, 2))
      console.log(`  → media-${pilotArticle.featured_media}.json: ${mediaItem.source_url}`)
    }
  }

  console.log('\nWP export complete.')
}

main().catch((err) => {
  console.error('Export failed:', err)
  process.exit(1)
})
