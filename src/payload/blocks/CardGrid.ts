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
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'globe',
          options: [
            { label: 'Star', value: 'star' },
            { label: 'Tachometer', value: 'tachometer' },
            { label: 'Arrow Up Circle', value: 'arrow-up-circle' },
            { label: 'Sitemap', value: 'sitemap' },
            { label: 'Globe', value: 'globe' },
            { label: 'Pointer', value: 'pointer' },
            { label: 'Briefcase', value: 'briefcase' },
            { label: 'Users Cog', value: 'users-cog' },
          ],
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
