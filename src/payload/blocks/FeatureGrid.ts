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
          defaultValue: 'deploy',
          options: [
            { label: 'Deploy', value: 'deploy' },
            { label: 'Shield', value: 'shield' },
            { label: 'Cube', value: 'cube' },
            { label: 'Dollar', value: 'dollar' },
            { label: 'Rocket', value: 'rocket' },
            { label: 'Check', value: 'check' },
            { label: 'Clock', value: 'clock' },
            { label: 'Code', value: 'code' },
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
