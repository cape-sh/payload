import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    description: 'Site-wide navigation bar — links and CTA button',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nav_items',
      type: 'array',
      admin: {
        description: 'Navigation links shown in the header',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Link text shown in the nav bar',
          },
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description: 'URL path (e.g. "/features" or "https://external.com")',
          },
        },
      ],
    },
    {
      name: 'cta_label',
      type: 'text',
      admin: {
        description: 'CTA button text (e.g. "Get Started")',
      },
    },
    {
      name: 'cta_href',
      type: 'text',
      admin: {
        description: 'CTA button link (e.g. "/test-drive")',
      },
    },
  ],
}
