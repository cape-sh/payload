'use client'

import React, { useState, useEffect, useCallback } from 'react'
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

interface UseCaseItem {
  title: string
  description: string
  icon?: string | null
  id?: string
}

interface UseCaseCarouselBlockProps {
  headline?: string | null
  items?: UseCaseItem[] | null
}

const icons: Record<string, React.ReactNode> = {
  star: <StarIcon className="h-12 w-12" />,
  tachometer: <TachometerIcon className="h-12 w-12" />,
  'arrow-up-circle': <ArrowUpCircleIcon className="h-12 w-12" />,
  sitemap: <SitemapIcon className="h-12 w-12" />,
  globe: <GlobeIcon className="h-12 w-12" />,
  pointer: <PointerIcon className="h-12 w-12" />,
  briefcase: <BriefcaseIcon className="h-12 w-12" />,
  'users-cog': <UsersCogIcon className="h-12 w-12" />,
}

export function UseCaseCarouselBlock({ headline, items }: UseCaseCarouselBlockProps) {
  const allItems = items ?? []
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % allItems.length) + allItems.length) % allItems.length)
    },
    [allItems.length],
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  // Auto-advance every 6s
  useEffect(() => {
    if (allItems.length <= 1) return
    const timer = setInterval(() => goTo(activeIndex + 1), 6000)
    return () => clearInterval(timer)
  }, [activeIndex, allItems.length, goTo])

  if (allItems.length === 0) return null

  const current = allItems[activeIndex]

  return (
    <section className="bg-[#2A2D2F] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {headline && (
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
            {headline}<span className="text-accent">.</span>
          </h2>
        )}

        <div className="relative min-h-[280px]">
          {/* Current slide */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 text-accent">
              {icons[current.icon || 'star'] || icons.star}
            </div>
            <p className="mb-4 text-xl font-semibold text-white md:text-2xl">
              {current.title}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-accent-light md:text-base">
              {current.description}
            </p>
          </div>

          {/* Navigation arrows */}
          {allItems.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-accent-light transition-colors hover:text-white"
                aria-label="Previous use case"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 text-accent-light transition-colors hover:text-white"
                aria-label="Next use case"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {allItems.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {allItems.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-6 w-6 flex items-center justify-center rounded-full transition-colors`}
                aria-label={`Go to use case ${i + 1}`}
              >
                <span className={`block h-2.5 w-2.5 rounded-full ${
                  i === activeIndex ? 'bg-accent' : 'bg-accent-light/30'
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
