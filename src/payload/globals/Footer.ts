import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    description: 'Site-wide footer — link groups and social media URLs',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'link_groups',
      type: 'array',
      admin: {
        description: 'Footer columns with grouped links',
      },
      fields: [
        {
          name: 'group_label',
          type: 'text',
          required: true,
          admin: {
            description: 'Column heading (e.g. "Product", "Company")',
          },
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'social_github',
      type: 'text',
      admin: {
        description: 'GitHub profile URL',
      },
    },
    {
      name: 'social_linkedin',
      type: 'text',
      admin: {
        description: 'LinkedIn page URL',
      },
    },
    {
      name: 'social_twitter',
      type: 'text',
      admin: {
        description: 'X/Twitter profile URL',
      },
    },
  ],
}
