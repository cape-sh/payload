'use client'

import { useEffect, useState } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface DocsTableOfContentsProps {
  headings: TocHeading[]
}

export function DocsTableOfContents({ headings }: DocsTableOfContentsProps) {
  const [activeId, setActiveId] = useState('')

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

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent-light">
        On this page
      </h4>
      <ul className="space-y-1.5 border-l border-dark-light">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block border-l-2 py-0.5 text-[13px] leading-snug transition-colors ${
                heading.level === 3 ? 'pl-6' : 'pl-3'
              } ${
                activeId === heading.id
                  ? 'border-accent font-medium text-accent'
                  : 'border-transparent text-accent-light/70 hover:text-accent-light'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
