import type { Block } from 'payload'

export const CardGrid: Block = {
  slug: 'cardGrid',
  interfaceName: 'CardGridBlock',
  labels: {
    singular: 'Card Grid',
    plural: 'Card Grids',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the headline' },
    },
    {
      name: 'headline',
      type: 'text',
      admin: { description: 'Section headline' },
    },
    {
      name: 'cards',
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
        },
      ],
    },
    {
      name: 'cta_label',
      type: 'text',
    },
    {
      name: 'cta_href',
      type: 'text',
    },
  ],
}
