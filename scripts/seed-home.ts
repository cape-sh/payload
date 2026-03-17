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
      eyebrow: 'Why CAEPE',
      headline: 'Built for enterprise Kubernetes',
      items: [
        {
          title: 'Enhance Deployment Quality and Consistency',
          description: 'Standardise deployment workflows across all clusters and environments with GitOps principles at scale.',
          icon: 'star' as const,
        },
        {
          title: 'Accelerate Time to Market',
          description: 'Ship faster with automated progressive delivery pipelines and advanced deployment strategies.',
          icon: 'tachometer' as const,
        },
        {
          title: 'Manage Software Upgrades',
          description: 'Coordinate Kubernetes and application upgrades across hundreds of clusters with deployment strategies.',
          icon: 'arrow-up-circle' as const,
        },
        {
          title: 'Test Production Applications',
          description: 'Smoke test deployments and validate Kubernetes version compatibility before and after releases.',
          icon: 'sitemap' as const,
        },
      ],
      cta_label: 'See all features',
      cta_href: '/features',
    },
    {
      blockType: 'cardGrid' as const,
      eyebrow: 'Use Cases',
      headline: 'How teams use CAEPE',
      cards: [
        { title: 'Support Regional and Global Deployments', description: 'Deploy to edge, air-gapped, and multi-region clusters from a single pane.', icon: 'globe' as const },
        { title: 'Bridge Kubernetes Skill Gaps', description: 'Enable teams of all skill levels to deploy with guardrails and automation.', icon: 'pointer' as const },
        { title: 'Address Enterprise Requirements', description: 'Security, governance, RBAC/SSO integration, and audit trails built for enterprise.', icon: 'briefcase' as const },
        { title: 'Reduce DevOps Team Effort', description: 'Automate repetitive tasks and reduce reliance on specialised DevOps resources.', icon: 'users-cog' as const },
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
  console.log('  - 2 FeatureGrid blocks (4 items each)')
  console.log('  - 1 CardGrid block (6 use cases)')
  console.log('  - 1 Hero block (pilot CTA)')

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
