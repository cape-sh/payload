/**
 * Seed Payload via Local API
 * Creates Pages and Resources documents from transformed WP data.
 *
 * Usage: npx tsx scripts/seed-payload.ts
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load .env.local BEFORE importing Payload config (ES imports are hoisted)
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

const SEED_FILE = join(process.cwd(), 'migration', 'wp-export', 'payload-seed-data.json')

async function main() {
  if (!existsSync(SEED_FILE)) {
    console.error('Seed file not found. Run wp-export.ts and wp-to-payload-transform.ts first.')
    process.exit(1)
  }

  const seedData = JSON.parse(readFileSync(SEED_FILE, 'utf-8'))

  console.log('Initialising Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  // --- Seed Pages ---
  console.log(`\nSeeding ${seedData.pages.length} pages...`)
  let pagesCreated = 0

  for (const page of seedData.pages) {
    // Check if page already exists
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ⚠ Page "${page.title}" (slug: ${page.slug}) already exists — skipping`)
      continue
    }

    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        meta: page.meta,
        layout: [],
        _status: 'draft',
      },
    })
    pagesCreated++
    console.log(`  ✓ Created page: "${page.title}" (/${page.slug})`)
  }

  // --- Upload featured media & Seed Articles ---
  console.log(`\nSeeding ${seedData.articles.length} articles...`)
  let articlesCreated = 0

  for (const article of seedData.articles) {
    // Check if article already exists
    const existing = await payload.find({
      collection: 'resources',
      where: { slug: { equals: article.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ⚠ Article "${article.title}" (slug: ${article.slug}) already exists — skipping`)
      continue
    }

    // Upload featured image if URL provided
    let featureImageId: number | undefined
    if (article.featured_media_url) {
      try {
        console.log(`  ↓ Downloading: ${article.featured_media_url}`)
        const imageRes = await fetch(article.featured_media_url)
        if (imageRes.ok) {
          const buffer = Buffer.from(await imageRes.arrayBuffer())
          const filename = article.featured_media_url.split('/').pop() || 'featured.png'

          const mediaDoc = await payload.create({
            collection: 'media',
            data: {
              alt: article.featured_media_alt || article.title,
            },
            file: {
              data: buffer,
              name: filename,
              mimetype: imageRes.headers.get('content-type') || 'image/png',
              size: buffer.length,
            },
          })
          featureImageId = mediaDoc.id
          console.log(`  ✓ Uploaded media: ${filename} (ID: ${featureImageId})`)
        }
      } catch (err) {
        console.log(`  ⚠ Failed to upload featured image: ${err}`)
      }
    }

    await payload.create({
      collection: 'resources',
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        publish_date: article.publish_date,
        reading_time: article.reading_time,
        tags: article.tags,
        meta: article.meta,
        feature_image: featureImageId,
        _status: 'draft',
      },
    })
    articlesCreated++
    console.log(`  ✓ Created article: "${article.title}"`)
  }

  // --- Summary ---
  console.log('\n--- Migration Summary ---')
  console.log(`Pages: ${seedData.pages.length} in seed → ${pagesCreated} created`)
  console.log(`Articles: ${seedData.articles.length} in seed → ${articlesCreated} created`)

  // Verify counts
  const totalPages = await payload.count({ collection: 'pages' })
  const totalResources = await payload.count({ collection: 'resources' })
  const totalMedia = await payload.count({ collection: 'media' })
  console.log(`\nPayload totals: ${totalPages.totalDocs} pages, ${totalResources.totalDocs} resources, ${totalMedia.totalDocs} media`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
