/**
 * Seed Pricing Page — populates /pricing with Hero + PricingTable block
 * Data extracted from caepe.sh/pricing/ WP export.
 *
 * Usage: npx tsx scripts/seed-pricing.ts
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

  // Find the pricing page
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'pricing' } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) {
    console.error('Pricing page not found. Run seed-payload.ts first.')
    process.exit(1)
  }

  const layout = [
    {
      blockType: 'hero' as const,
      headline: 'Pricing Made Simple.',
      subheadline: 'Pay only for clusters connected for 24 hours or more.',
      cta_label: 'Get started with CAEPE',
      cta_href: '/test-drive',
    },
    {
      blockType: 'pricingTable' as const,
      headline: '',
      subheadline: '',
      included_features: [
        { feature: 'Full enterprise support' },
        { feature: 'Unlimited applications, workloads and services' },
        { feature: 'Unlimited nodes' },
        { feature: 'RBAC/SSO integration' },
        { feature: 'DORA metrics' },
        { feature: 'Option of SaaS or Self-hosted' },
      ],
      tiers: [
        {
          tier_name: 'Up to 25 clusters',
          price: '500.00',
          price_suffix: 'Per cluster* (monthly)',
          highlight: false,
          cta_label: 'Get Started',
          cta_href: '/test-drive',
        },
        {
          tier_name: '25+ clusters',
          price: '250.00',
          price_suffix: 'Per cluster* (monthly)',
          highlight: true,
          cta_label: 'Get Started',
          cta_href: '/test-drive',
        },
        {
          tier_name: '100+ clusters',
          price: 'custom',
          price_suffix: '',
          highlight: false,
          cta_label: 'Talk to us',
          cta_href: 'mailto:letschat@caepe.sh',
        },
      ],
      footnote: '*Clusters charged as active after 24 hours | Pricing in USD',
    },
  ]

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout },
  })

  console.log('\n✓ Pricing page updated with:')
  console.log('  - 1 Hero block')
  console.log('  - 1 PricingTable block (3 tiers, 6 included features)')

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
