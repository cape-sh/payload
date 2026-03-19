import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface FeatureGridItem {
  title: string
  description: string
  icon?: string | null
  id?: string
}

interface FeatureGridBlockProps {
  eyebrow?: string | null
  headline?: string | null
  items?: FeatureGridItem[] | null
  cta_label?: string | null
  cta_href?: string | null
  style?: string | null
}

const iconImages: Record<string, string> = {
  'extended-gitops': '/images/features/extended-gitops.svg',
  'enterprise-compliant': '/images/features/enterprise-compliant.svg',
  'simplified-kubernetes': '/images/features/simplified-kubernetes.svg',
  'transparent-pricing': '/images/features/transparent-pricing.svg',
  'progressive-delivery': '/images/features/progressive-delivery.svg',
  'confident-delivery': '/images/features/confident-delivery.svg',
  'scheduling-grouping': '/images/features/scheduling-grouping.svg',
  'api-scripting': '/images/features/api-scripting.svg',
}

export function FeatureGridBlock({ eyebrow, headline, items, cta_label, cta_href, style }: FeatureGridBlockProps) {
  const isCircleStyle = style === 'circle'

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {(eyebrow || headline) && (
          <div className="mb-12 text-center">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">{headline}</h2>
            )}
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(items ?? []).map((item, i) => {
            const imgSrc = iconImages[item.icon || '']

            return (
              <div
                key={item.id ?? i}
                className="flex flex-col items-center text-center"
              >
                {imgSrc ? (
                  <div className={`mb-6 flex items-center justify-center ${isCircleStyle ? 'h-36 w-36 rounded-full bg-[#C8CDD0]' : 'h-24 w-24'}`}>
                    <Image
                      src={imgSrc}
                      alt={item.title}
                      width={isCircleStyle ? 100 : 80}
                      height={isCircleStyle ? 100 : 80}
                      className={isCircleStyle ? 'h-[100px] w-[100px]' : 'h-20 w-20'}
                    />
                  </div>
                ) : (
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-accent-light">{item.description}</p>
              </div>
            )
          })}
        </div>

        {cta_label && cta_href && (
          <div className="mt-10 text-center">
            <Link
              href={cta_href}
              className="inline-flex items-center gap-2 rounded bg-accent-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              {cta_label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
