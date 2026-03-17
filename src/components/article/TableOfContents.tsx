'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
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

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent-light">
        On this page
      </h4>
      <ul className="space-y-2 border-l border-dark-light">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block border-l-2 py-1 text-sm transition-colors ${
                heading.level === 3 ? 'pl-8' : 'pl-4'
              } ${
                activeId === heading.id
                  ? 'border-accent font-medium text-accent'
                  : 'border-transparent text-accent-light hover:text-white'
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
