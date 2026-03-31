import type { Block } from 'payload'

export const UseCaseCarousel: Block = {
  slug: 'useCaseCarousel',
  imageURL: '/images/blocks/use-case-carousel-preview.svg',
  interfaceName: 'UseCaseCarouselBlock',
  labels: {
    singular: 'Use Case Carousel',
    plural: 'Use Case Carousels',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      defaultValue: 'Use Cases',
      admin: { description: 'Section headline' },
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
          ],
        },
      ],
    },
  ],
}
