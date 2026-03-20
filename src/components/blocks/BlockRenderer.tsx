import { HeroBlock } from './HeroBlock'
import { FeatureAccordionBlock } from './FeatureAccordionBlock'
import { PricingTableBlock } from './PricingTableBlock'
import { CTAFormBlock } from './CTAFormBlock'
import { FeatureGridBlock } from './FeatureGridBlock'
import { CardGridBlock } from './CardGridBlock'
import { UseCaseCarouselBlock } from './UseCaseCarouselBlock'

interface Block {
  blockType: string
  [key: string]: unknown
}

interface BlockRendererProps {
  blocks: Block[]
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={i} {...(block as any)} />
          case 'featureAccordion':
            return (
              <FeatureAccordionBlock
                key={i}
                section_label={block.section_label as string}
                section_title={block.section_title as string}
                items={block.items as any}
                id={`section-${i}`}
              />
            )
          case 'pricingTable':
            return <PricingTableBlock key={i} {...(block as any)} />
          case 'ctaForm':
            return <CTAFormBlock key={i} {...(block as any)} />
          case 'featureGrid':
            return <FeatureGridBlock key={i} {...(block as any)} style={(block as any).style} />
          case 'cardGrid':
            return <CardGridBlock key={i} {...(block as any)} />
          case 'useCaseCarousel':
            return <UseCaseCarouselBlock key={i} {...(block as any)} />
          default:
            return null
        }
      })}
    </>
  )
}
