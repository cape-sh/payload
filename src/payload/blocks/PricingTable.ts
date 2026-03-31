import type { Block } from 'payload'

export const PricingTable: Block = {
  slug: 'pricingTable',
  imageURL: '/images/blocks/pricing-table-preview.svg',
  labels: {
    singular: 'Pricing Table',
    plural: 'Pricing Tables',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Section heading above the pricing tiers',
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
      name: 'included_features',
      type: 'array',
      admin: {
        description: 'Features included in all plans — shown above the tier cards',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'tiers',
      type: 'array',
      admin: {
        description: 'Pricing tiers — typically 3 columns',
      },
      fields: [
        {
          name: 'tier_name',
          type: 'text',
          required: true,
          admin: {
            description: 'Tier heading (e.g. "Up to 25 clusters")',
          },
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          admin: {
            description: 'Price display (e.g. "500.00" or "custom")',
          },
        },
        {
          name: 'price_suffix',
          type: 'text',
          admin: {
            description: 'Text after the price (e.g. "Per cluster* (monthly)")',
          },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Highlight this tier with a border accent',
          },
        },
        {
          name: 'cta_label',
          type: 'text',
          admin: {
            description: 'Button text (e.g. "Get Started" or "Talk to us")',
          },
        },
        {
          name: 'cta_href',
          type: 'text',
          admin: {
            description: 'Button link (e.g. "/test-drive" or "mailto:letschat@caepe.sh")',
          },
        },
      ],
    },
    {
      name: 'footnote',
      type: 'text',
      admin: {
        description: 'Small print below the pricing tiers',
      },
    },
  ],
}
