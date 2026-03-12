import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publish_date', 'author'],
    description: 'Articles, guides, and other resources',
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        if (doc._status === 'published') {
          revalidatePath(`/resources/${doc.slug}`)
          revalidatePath('/resources')
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Article title — appears as the main heading and in search results',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path for this article (e.g. "getting-started" becomes /resources/getting-started)',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on the resources index page (max 250 characters)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'The full article body — use headings, lists, code blocks, and images',
      },
    },
    {
      name: 'feature_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image shown at the top of the article and on resource cards',
      },
    },
    {
      name: 'author',
      type: 'text',
      admin: {
        description: 'Author name displayed on the article',
      },
    },
    {
      name: 'publish_date',
      type: 'date',
      admin: {
        description: 'Publication date — articles are sorted by this date (newest first)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'reading_time',
      type: 'number',
      admin: {
        description: 'Estimated reading time in minutes',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for categorising this article — used for filtering on the resources page',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'related_posts',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
      admin: {
        description: 'Related articles shown at the bottom of this article (select up to 3)',
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'meta_title',
          type: 'text',
          admin: {
            description: 'SEO title (50-60 characters ideal)',
          },
        },
        {
          name: 'meta_description',
          type: 'textarea',
          admin: {
            description: 'SEO description (150-160 characters ideal)',
          },
        },
      ],
    },
  ],
}
