import type { Block } from 'payload'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
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
          defaultValue: 'star',
          options: [
            { label: 'Star', value: 'star' },
            { label: 'Tachometer', value: 'tachometer' },
            { label: 'Arrow Up Circle', value: 'arrow-up-circle' },
            { label: 'Sitemap', value: 'sitemap' },
            { label: 'Globe', value: 'globe' },
            { label: 'Pointer', value: 'pointer' },
            { label: 'Briefcase', value: 'briefcase' },
            { label: 'Users Cog', value: 'users-cog' },
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
