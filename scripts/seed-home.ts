/**
 * Seed Homepage — populates / with Hero + FeatureGrid + CardGrid + CTA blocks
 * Data extracted from caepe.sh homepage.
 *
 * Usage: npx tsx scripts/seed-home.ts
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

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

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  const layout: any[] = [
    {
      blockType: 'hero' as const,
      headline: 'Deploy workloads at scale.',
      subheadline: 'CAEPE extends GitOps and simplifies Kubernetes continuous deployment for all skill levels. Deploy confidently across environments with automated workflows, progressive delivery, and enterprise features.',
      cta_label: 'Start here',
      cta_href: '/test-drive',
    },
    {
      blockType: 'featureGrid' as const,
      style: 'default',
      items: [
        {
          title: 'Extended GitOps',
          description: 'Distributed deployment management across multiple clusters with GitOps principles at scale.',
          icon: 'extended-gitops' as const,
        },
        {
          title: 'Enterprise Compliant',
          description: 'Security, governance, RBAC/SSO integration, and audit trails built for enterprise requirements.',
          icon: 'enterprise-compliant' as const,
        },
        {
          title: 'Simplified Kubernetes',
          description: 'Abstracted complexity so teams of all skill levels can deploy with confidence.',
          icon: 'simplified-kubernetes' as const,
        },
        {
          title: 'Transparent Pricing & Support',
          description: 'Clear per-cluster pricing with full enterprise support included. No hidden fees.',
          icon: 'transparent-pricing' as const,
        },
      ],
      cta_label: 'See all features',
      cta_href: '/features',
    },
    {
      blockType: 'featureGrid' as const,
      headline: 'Features.',
      style: 'circle',
      items: [
        {
          title: 'Progressive Delivery',
          description: 'Advanced deployment strategies for smooth rollouts.',
          icon: 'progressive-delivery' as const,
        },
        {
          title: 'Confident Delivery',
          description: 'Pre-flight Tests, Post Deployment Actions & Dry Runs.',
          icon: 'confident-delivery' as const,
        },
        {
          title: 'Scheduling & Grouping',
          description: 'Controlled deployment and approval workflows.',
          icon: 'scheduling-grouping' as const,
        },
        {
          title: 'API-first & Powerful Scripting',
          description: 'Integration and automation at every level.',
          icon: 'api-scripting' as const,
        },
      ],
    },
    {
      blockType: 'hero' as const,
      headline: 'Free Pilot Program',
      subheadline: 'Evaluate CAEPE in your own environment with structured onboarding and full enterprise support. No credit card required.',
      cta_label: 'Start your pilot',
      cta_href: '/test-drive',
    },
  ]

  if (existing.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: { layout },
    })
    console.log('✓ Homepage updated')
  } else {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout,
        meta: {
          meta_title: 'CAEPE — Streamline Kubernetes Continuous Deployment',
          meta_description: 'CAEPE extends GitOps and simplifies deployment for all skill levels. Deploy confidently across environments with automated workflows and enterprise features.',
        },
        _status: 'published',
      },
    })
    console.log('✓ Homepage created')
  }

  console.log('\n  - 1 Hero block (main)')
  console.log('  - 2 FeatureGrid blocks (4 illustration icons each)')
  console.log('  - 1 Hero block (pilot CTA)')

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
