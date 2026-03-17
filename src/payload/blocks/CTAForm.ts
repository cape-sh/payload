import type { Block } from 'payload'

export const CTAForm: Block = {
  slug: 'ctaForm',
  interfaceName: 'CTAFormBlock',
  labels: {
    singular: 'CTA Form',
    plural: 'CTA Forms',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      admin: {
        description: 'Form section headline (e.g. "Request a Demo")',
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
      name: 'form_id',
      type: 'select',
      required: true,
      defaultValue: 'demo-request',
      options: [
        { label: 'Demo Request', value: 'demo-request' },
        { label: 'Contact', value: 'contact' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
      admin: {
        description: 'Which form to display in this block',
      },
    },
    {
      name: 'body_copy',
      type: 'richText',
      admin: {
        description: 'Optional additional content below the form',
      },
    },
  ],
}
