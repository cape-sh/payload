import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  imageURL: '/images/blocks/hero-preview.svg',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: 'Main heading text — appears as the large H1',
      },
    },
    {
      name: 'subheadline',
      type: 'textarea',
      admin: {
        description: 'Supporting text below the headline',
      },
    },
    {
      name: 'cta_label',
      type: 'text',
      admin: {
        description: 'Primary button text (e.g. "Get Started")',
      },
    },
    {
      name: 'cta_href',
      type: 'text',
      admin: {
        description: 'Primary button link (e.g. "/test-drive")',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional hero image',
      },
    },
  ],
}
