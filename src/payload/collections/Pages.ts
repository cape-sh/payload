import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    description: 'Marketing pages built from reusable content blocks',
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
          const slug = doc.slug === 'home' ? '/' : `/${doc.slug}`
          revalidatePath(slug)
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
        description: 'The page title — appears in the browser tab and as the main heading',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path for this page (e.g. "features" becomes /features)',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [],
      admin: {
        description: 'Add and arrange content blocks to build the page',
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
            description: 'SEO title — appears in search results (50-60 characters ideal)',
          },
        },
        {
          name: 'meta_description',
          type: 'textarea',
          admin: {
            description: 'SEO description — appears below the title in search results (150-160 characters ideal)',
          },
        },
        {
          name: 'og_image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Social sharing image — shown when the page is shared on Twitter/LinkedIn (1200x630px)',
          },
        },
      ],
    },
  ],
}
