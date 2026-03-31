import type { Block } from 'payload'

export const FeatureAccordion: Block = {
  slug: 'featureAccordion',
  imageURL: '/images/blocks/feature-accordion-preview.svg',
  labels: {
    singular: 'Feature Accordion',
    plural: 'Feature Accordions',
  },
  interfaceName: 'FeatureAccordionBlock',
  fields: [
    {
      name: 'section_label',
      type: 'text',
      admin: {
        description: 'Eyebrow text above the section title (e.g. "Unique CAEPE Features")',
      },
    },
    {
      name: 'section_title',
      type: 'text',
      required: true,
      admin: {
        description: 'Section heading (e.g. "Deployment", "Smoke Testing")',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description: 'Feature items within this accordion section',
      },
      fields: [
        {
          name: 'feature_name',
          type: 'text',
          required: true,
          admin: {
            description: 'Feature name shown in bold',
          },
        },
        {
          name: 'feature_description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Feature description paragraph',
          },
        },
      ],
    },
  ],
}
