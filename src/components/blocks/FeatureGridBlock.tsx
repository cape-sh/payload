import React from 'react'
import Link from 'next/link'
import {
  StarIcon,
  TachometerIcon,
  ArrowUpCircleIcon,
  SitemapIcon,
  GlobeIcon,
  PointerIcon,
  BriefcaseIcon,
  UsersCogIcon,
} from '@/components/icons/FeatureIcons'

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
}

const icons: Record<string, React.ReactNode> = {
  star: <StarIcon className="h-6 w-6" />,
  tachometer: <TachometerIcon className="h-6 w-6" />,
  'arrow-up-circle': <ArrowUpCircleIcon className="h-6 w-6" />,
  sitemap: <SitemapIcon className="h-6 w-6" />,
  globe: <GlobeIcon className="h-6 w-6" />,
  pointer: <PointerIcon className="h-6 w-6" />,
  briefcase: <BriefcaseIcon className="h-6 w-6" />,
  'users-cog': <UsersCogIcon className="h-6 w-6" />,
  // Legacy icon mappings (old CMS data)
  deploy: <StarIcon className="h-6 w-6" />,
  shield: <BriefcaseIcon className="h-6 w-6" />,
  cube: <SitemapIcon className="h-6 w-6" />,
  dollar: <StarIcon className="h-6 w-6" />,
  rocket: <TachometerIcon className="h-6 w-6" />,
  check: <ArrowUpCircleIcon className="h-6 w-6" />,
  clock: <SitemapIcon className="h-6 w-6" />,
  code: <GlobeIcon className="h-6 w-6" />,
}

export function FeatureGridBlock({ eyebrow, headline, items, cta_label, cta_href }: FeatureGridBlockProps) {
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(items ?? []).map((item, i) => (
            <div
              key={item.id ?? i}
              className="rounded-lg border border-dark-light p-6 transition-colors hover:border-accent/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent">
                {icons[item.icon || 'star'] || icons.star}
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-accent-light">{item.description}</p>
            </div>
          ))}
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
