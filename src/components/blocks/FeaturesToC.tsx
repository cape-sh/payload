'use client'

import { useEffect, useState } from 'react'

interface ToCSection {
  id: string
  title: string
}

interface FeaturesToCProps {
  sections: ToCSection[]
}

export function FeaturesToC({ sections }: FeaturesToCProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )

    for (const section of sections) {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sections])

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent-light">
        On this page
      </h4>
      <ul className="space-y-2 border-l border-dark-light">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block border-l-2 py-1 pl-4 text-sm transition-colors ${
                activeId === section.id
                  ? 'border-accent font-medium text-accent'
                  : 'border-transparent text-accent-light hover:text-white'
              }`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>

      {/* PDF download CTA */}
      <div className="mt-8">
        <a
          href="/caepe-overview.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-dark-light px-4 py-2 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Overview PDF
        </a>
      </div>
    </nav>
  )
}
