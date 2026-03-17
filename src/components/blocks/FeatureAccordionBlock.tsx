'use client'

import { useState } from 'react'

interface FeatureItem {
  feature_name: string
  feature_description: string
  id?: string
}

interface FeatureAccordionBlockProps {
  section_label?: string | null
  section_title: string
  items?: FeatureItem[] | null
  id?: string
}

export function FeatureAccordionBlock({
  section_label,
  section_title,
  items,
  id,
}: FeatureAccordionBlockProps) {
  const [open, setOpen] = useState(false)

  return (
    <div id={id} className="border-b border-dark-light">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-6 text-left transition-colors hover:bg-dark-light md:px-0"
        aria-expanded={open}
      >
        <div>
          {section_label && (
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {section_label}
            </span>
          )}
          <h2 className="text-xl font-bold text-white md:text-2xl">{section_title}</h2>
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 text-accent-light transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className={`grid transition-all duration-200 ${open ? 'grid-rows-[1fr] pb-8' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-4 px-6 md:grid-cols-2 md:gap-6 md:px-0 lg:grid-cols-3">
            {(items ?? []).map((item, i) => (
              <div
                key={item.id ?? i}
                className="rounded-lg border border-dark-light bg-dark-light p-5"
              >
                <h3 className="font-semibold text-white">{item.feature_name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-accent-light">
                  {item.feature_description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
