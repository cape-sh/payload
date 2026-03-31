import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  imageURL: '/images/blocks/feature-grid-preview.svg',
  interfaceName: 'FeatureGridBlock',
  labels: {
    singular: 'Feature Grid',
    plural: 'Feature Grids',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the headline (e.g. "Why CAEPE")',
      },
    },
    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Section headline',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (no background)', value: 'default' },
        { label: 'Circle (gray circle background)', value: 'circle' },
      ],
      admin: {
        description: 'Icon display style',
      },
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'extended-gitops',
          options: [
            { label: 'Extended GitOps', value: 'extended-gitops' },
            { label: 'Enterprise Compliant', value: 'enterprise-compliant' },
            { label: 'Simplified Kubernetes', value: 'simplified-kubernetes' },
            { label: 'Transparent Pricing', value: 'transparent-pricing' },
            { label: 'Progressive Delivery', value: 'progressive-delivery' },
            { label: 'Confident Delivery', value: 'confident-delivery' },
            { label: 'Scheduling & Grouping', value: 'scheduling-grouping' },
            { label: 'API Scripting', value: 'api-scripting' },
            // Legacy values kept for backward compatibility
            { label: 'Star (legacy)', value: 'star' },
            { label: 'Tachometer (legacy)', value: 'tachometer' },
            { label: 'Arrow Up Circle (legacy)', value: 'arrow-up-circle' },
            { label: 'Sitemap (legacy)', value: 'sitemap' },
            { label: 'Globe (legacy)', value: 'globe' },
            { label: 'Pointer (legacy)', value: 'pointer' },
            { label: 'Briefcase (legacy)', value: 'briefcase' },
            { label: 'Users Cog (legacy)', value: 'users-cog' },
            { label: 'Deploy (legacy)', value: 'deploy' },
            { label: 'Shield (legacy)', value: 'shield' },
            { label: 'Cube (legacy)', value: 'cube' },
            { label: 'Dollar (legacy)', value: 'dollar' },
            { label: 'Rocket (legacy)', value: 'rocket' },
            { label: 'Check (legacy)', value: 'check' },
            { label: 'Clock (legacy)', value: 'clock' },
            { label: 'Code (legacy)', value: 'code' },
          ],
        },
      ],
    },
    {
      name: 'cta_label',
      type: 'text',
      admin: { description: 'Optional CTA button text' },
    },
    {
      name: 'cta_href',
      type: 'text',
      admin: { description: 'Optional CTA button link' },
    },
  ],
}
