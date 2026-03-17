/**
 * Seed Navigation + Footer globals — populates header nav and footer
 * Data based on caepe.sh site structure.
 *
 * Usage: npx tsx scripts/seed-globals.ts
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

  // Seed Navigation global
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      nav_items: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Resources', href: '/resources' },
        { label: 'Docs', href: '/docs' },
      ],
      cta_label: 'Test Drive',
      cta_href: '/test-drive',
    },
  })

  console.log('✓ Navigation global seeded')

  // Seed Footer global
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      link_groups: [
        {
          group_label: 'Product',
          links: [
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Test Drive', href: '/test-drive' },
            { label: 'Docs', href: '/docs' },
          ],
        },
        {
          group_label: 'Resources',
          links: [
            { label: 'Resources', href: '/resources' },
            { label: 'Use Cases', href: '/use-cases' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          group_label: 'Legal',
          links: [
            { label: 'EUSA', href: '/end-user-subscription-agreement' },
            { label: 'EULA', href: '/end-user-license-agreement' },
          ],
        },
      ],
      social_github: 'https://github.com/cape-sh',
      social_linkedin: 'https://www.linkedin.com/company/getcaepe',
      social_twitter: 'https://twitter.com/getcaepe',
    },
  })

  console.log('✓ Footer global seeded')
  console.log('\nDone! Navigation and footer are now populated.')

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
