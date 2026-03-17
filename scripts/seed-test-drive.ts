/**
 * Seed Test Drive Page — populates /test-drive with Hero + CTAForm block
 * Data based on caepe.sh/caepe-test-drive/
 *
 * Usage: npx tsx scripts/seed-test-drive.ts
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Load .env.local before importing Payload config
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

async function main() {
  console.log('Initialising Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  // Check if test-drive page already exists
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'test-drive' } },
    limit: 1,
  })

  const layout = [
    {
      blockType: 'hero' as const,
      headline: 'Take CAEPE for a Test Drive',
      subheadline: 'Get hands-on with CAEPE in your own environment. No credit card required.',
      cta_label: null,
      cta_href: null,
    },
    {
      blockType: 'ctaForm' as const,
      headline: 'Request a Demo',
      subheadline: 'Fill out the form below and our team will set up a personalized demo for you.',
      form_id: 'demo-request' as const,
    },
  ]

  if (existing.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: { layout },
    })
    console.log('✓ Test Drive page updated')
  } else {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Test Drive',
        slug: 'test-drive',
        layout,
        meta: {
          meta_title: 'Test Drive CAEPE — Free Demo',
          meta_description:
            'Request a free demo of CAEPE. Deploy anywhere, manage everything. No credit card required.',
        },
        _status: 'published',
      },
    })
    console.log('✓ Test Drive page created')
  }

  console.log('\n  - 1 Hero block')
  console.log('  - 1 CTAForm block (demo-request)')

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
