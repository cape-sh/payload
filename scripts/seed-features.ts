/**
 * Seed Features Page — populates the /features page with Hero + 6 FeatureAccordion blocks
 * extracted from the WP export data.
 *
 * Usage: npx tsx scripts/seed-features.ts
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

// Feature data extracted from WP export (caepe.sh/features/)
const featuresData = {
  hero: {
    headline: 'Enterprise Continuous Deployment for Kubernetes',
    subheadline:
      'CAEPE extends GitOps to simplify complex deployments across diverse environments with robust authorization, authentication, and audit trails for enterprise compliance.',
    cta_label: 'Start Your Test Drive',
    cta_href: '/test-drive',
  },
  sections: [
    {
      section_label: 'Unique CAEPE Features',
      section_title: 'Deployment',
      items: [
        {
          feature_name: 'Rolling Deployment',
          feature_description:
            'Deploy applications and services through rolling deployment methodology with zero-downtime updates.',
        },
        {
          feature_name: 'A/B Deployment',
          feature_description:
            'Build an A/B deployment for applications and services to test different versions simultaneously.',
        },
        {
          feature_name: 'Blue/Green Deployment',
          feature_description:
            'Build a Blue/Green deployment for applications and services with instant rollback capability.',
        },
        {
          feature_name: 'Canary Deployment',
          feature_description:
            'Build a Canary deployment for applications and services to gradually roll out changes to a subset of users.',
        },
        {
          feature_name: 'Recreate / Highlander Deployment',
          feature_description:
            'Build a Recreate / Highlander deployment for applications and services — terminates old version before deploying new.',
        },
        {
          feature_name: 'Deployment Details',
          feature_description:
            'View deployment details including clusters deployed, deployment method, history, namespaces, time and size of deployment and differences between manifests.',
        },
        {
          feature_name: 'Deployment Queues',
          feature_description:
            'Manage deployment queue to ensure applications and services deployed in order required.',
        },
        {
          feature_name: 'Deployment Priority',
          feature_description:
            'Set deployment priority so that urgent deployments and updates get prioritized over other deployments.',
        },
        {
          feature_name: 'Deployment Schedules',
          feature_description:
            'Set schedules for maintenance windows on clusters restricting when apps can be deployed, upgraded or removed.',
        },
        {
          feature_name: 'Pre-flight Tests',
          feature_description:
            'Execute pre-flight tests to ensure application has all it requires to go live and that the chosen cluster meets the requirements.',
        },
        {
          feature_name: 'Dry Runs',
          feature_description:
            'Execute deployment dry runs to see what will be actioned on cluster and identify any potential conflicts or issues before actual deployment.',
        },
        {
          feature_name: 'Latest Changes',
          feature_description:
            'Scan for latest changes in a deployment to see how it differs from previous deployment manifests.',
        },
        {
          feature_name: 'Estimate Time & Size',
          feature_description:
            'Estimate time and size of a deployment to understand how long a maintenance window may need to be set for.',
        },
        {
          feature_name: 'Deployment Time & Size',
          feature_description:
            'View actual time and size for each deployment for tracking and optimization.',
        },
        {
          feature_name: 'Post-Deployment Actions',
          feature_description:
            'Execute a script or webhook after a deployment has been executed or an update has occurred.',
        },
      ],
    },
    {
      section_label: 'Unique CAEPE Features',
      section_title: 'Smoke Testing',
      items: [
        {
          feature_name: 'CAEPE Smoke Test',
          feature_description:
            'Quickly deploy a snapshot of a production app or latest version to an upgraded cluster or new cluster type to ensure compatibility before full rollout.',
        },
        {
          feature_name: 'Dedicated Smoke Test Clusters',
          feature_description:
            'Identify specific clusters as Smoke Test clusters so that they can only be used for restoring snapshots.',
        },
        {
          feature_name: 'Live Cluster Snapshot',
          feature_description:
            'Take a live snapshot of an application on cluster including Persistent Volume (PV) data to be restored on any other cluster.',
        },
        {
          feature_name: 'Snapshot Restore',
          feature_description:
            'Restore snapshots of applications and data to same or new cluster for testing and validation.',
        },
        {
          feature_name: 'Quick App Deploy',
          feature_description:
            'One shot application deploy for use on a smoke test cluster for rapid validation.',
        },
        {
          feature_name: 'Test Automation',
          feature_description:
            'Execute smoke, performance, pen or chaos tests after a quick app deploy or restore of a snapshot of a live application and its data.',
        },
      ],
    },
    {
      section_label: 'Unique CAEPE Features',
      section_title: 'Edge / Air Gapped',
      items: [
        {
          feature_name: 'Auto Cluster Build',
          feature_description:
            'Automatically build clusters for Edge/Air Gapped environments using SSH, CloudFormation, Azure, GCP, Ansible and Terraform.',
        },
        {
          feature_name: 'Cluster Tear Down',
          feature_description:
            'Tear down clusters built via auto cluster build to avoid excess running costs.',
        },
        {
          feature_name: 'Cluster Environment Type',
          feature_description:
            'Identify Edge or Air Gapped clusters so that they can be managed with a method that suits their environment.',
        },
        {
          feature_name: 'Development Queues',
          feature_description:
            'Manage deployment queue to ensure applications and services deployed in order required or when connectivity is available.',
        },
        {
          feature_name: 'Deployment Priority',
          feature_description:
            'Set deployment priority so that urgent deployments and updates get prioritized over other deployments when edge or air gapped maintenance windows are limited.',
        },
        {
          feature_name: 'Private Repo / Registry Management',
          feature_description:
            'Deploy a private repo or registry as part of the CAEPE self-hosted package for use in air gapped or edge situations.',
        },
        {
          feature_name: 'Estimate Time & Size',
          feature_description:
            'Estimate time and size of a deployment to understand how long a maintenance or connection window may need to be set for.',
        },
        {
          feature_name: 'Offline Subscription Management',
          feature_description:
            'Flexibility to add and remove clusters to subscription without being connected to CAEPE portal.',
        },
      ],
    },
    {
      section_label: 'Unique CAEPE Features',
      section_title: 'Clusters',
      items: [
        {
          feature_name: 'Multi-Cluster Support',
          feature_description:
            'Managed K8s clusters, virtualized clusters, bare metal clusters, cloud-based clusters, on-prem clusters, edge clusters and air gapped clusters.',
        },
        {
          feature_name: 'Cluster Tear Down',
          feature_description:
            'Tear down clusters built via auto cluster build to control infrastructure costs.',
        },
        {
          feature_name: 'Cluster Groups',
          feature_description:
            'Organize clusters into groups for batch operations, policy management and streamlined deployment workflows.',
        },
        {
          feature_name: 'Cluster Classification',
          feature_description:
            'Classify clusters by environment type, region, or purpose for targeted deployment strategies.',
        },
        {
          feature_name: 'Cluster Schedules',
          feature_description:
            'Set maintenance windows and operational schedules for individual clusters or cluster groups.',
        },
      ],
    },
    {
      section_label: 'Unique CAEPE Features',
      section_title: 'Applications',
      items: [
        {
          feature_name: 'Application Management',
          feature_description:
            'Comprehensive application lifecycle management across all connected clusters with deployment tracking and status monitoring.',
        },
        {
          feature_name: 'Application Groups',
          feature_description:
            'Group related applications together for coordinated deployments and batch operations across environments.',
        },
      ],
    },
    {
      section_label: 'Unique CAEPE Features',
      section_title: 'Subscription, Management & Support',
      items: [
        {
          feature_name: 'Self Hosted',
          feature_description:
            'Deploy CAEPE in your own infrastructure for complete data sovereignty and compliance requirements.',
        },
        {
          feature_name: 'Management Portal',
          feature_description:
            'Centralized management portal for overseeing all deployments, clusters, and application status.',
        },
        {
          feature_name: 'Azure Subscription',
          feature_description:
            'Available through the Azure Marketplace for simplified procurement and billing integration.',
        },
        {
          feature_name: 'Subscription Management',
          feature_description:
            'Flexible subscription management with the ability to scale cluster count up or down as needed.',
        },
        {
          feature_name: 'Health Log & Monitoring',
          feature_description:
            'Comprehensive health logging and monitoring for all clusters, deployments and infrastructure components.',
        },
        {
          feature_name: 'Enterprise Support',
          feature_description:
            'Full enterprise support included with all plans — dedicated assistance for deployment and operations.',
        },
        {
          feature_name: 'Schedules',
          feature_description:
            'Global and per-cluster scheduling for maintenance windows, deployment freezes and operational policies.',
        },
        {
          feature_name: 'Generate CLI',
          feature_description:
            'Generate CLI commands for automation and integration with existing CI/CD pipelines and scripts.',
        },
        {
          feature_name: 'Approvals',
          feature_description:
            'Deployment approval workflows to ensure changes are reviewed and authorized before execution.',
        },
      ],
    },
  ],
}

async function main() {
  console.log('Initialising Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  // Find the features page
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'features' } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) {
    console.error('Features page not found. Run seed-payload.ts first.')
    process.exit(1)
  }

  // Build the layout blocks
  const layout = [
    {
      blockType: 'hero' as const,
      ...featuresData.hero,
    },
    ...featuresData.sections.map((section) => ({
      blockType: 'featureAccordion' as const,
      section_label: section.section_label,
      section_title: section.section_title,
      items: section.items,
    })),
  ]

  // Count items
  const totalItems = featuresData.sections.reduce((sum, s) => sum + s.items.length, 0)

  // Update the features page with the layout
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout,
    },
  })

  console.log(`\n✓ Features page updated with:`)
  console.log(`  - 1 Hero block`)
  console.log(`  - ${featuresData.sections.length} FeatureAccordion blocks`)
  console.log(`  - ${totalItems} total feature items`)
  console.log(`\nSections:`)
  for (const section of featuresData.sections) {
    console.log(`  - ${section.section_title}: ${section.items.length} items`)
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
