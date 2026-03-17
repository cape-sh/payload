import type { Metadata } from 'next'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/metadata'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { FeatureAccordionBlock } from '@/components/blocks/FeatureAccordionBlock'
import { FeaturesToC } from '@/components/blocks/FeaturesToC'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'features' } },
    limit: 1,
    draft: false,
  })

  const page = result.docs[0]
  if (!page) return { title: 'Features — CAEPE' }
  return buildMetadata(page)
}

export default async function FeaturesPage() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'features' } },
    limit: 1,
    draft: true,
  })

  const page = result.docs[0]
  if (!page) return <div className="p-12 text-center">Page not found</div>

  const blocks = (page.layout ?? []) as any[]
  const heroBlocks = blocks.filter((b) => b.blockType === 'hero')
  const accordionBlocks = blocks.filter((b) => b.blockType === 'featureAccordion')

  const tocSections = accordionBlocks.map((b, i) => ({
    id: `section-${i}`,
    title: b.section_title as string,
  }))

  return (
    <>
      {/* Hero */}
      {heroBlocks.map((block, i) => (
        <HeroBlock key={i} {...block} />
      ))}

      {/* Accordion sections + sticky ToC */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex gap-12">
          <div className="min-w-0 flex-1">
            {accordionBlocks.map((block, i) => (
              <FeatureAccordionBlock
                key={i}
                section_label={block.section_label}
                section_title={block.section_title}
                items={block.items}
                id={`section-${i}`}
              />
            ))}
          </div>

          {/* Desktop sticky ToC */}
          {tocSections.length > 0 && (
            <aside className="hidden w-60 shrink-0 lg:block">
              <FeaturesToC sections={tocSections} />
            </aside>
          )}
        </div>
      </section>
    </>
  )
}
