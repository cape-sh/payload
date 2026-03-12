'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
}

interface MobileMenuProps {
  navItems: NavItem[]
  ctaLabel?: string | null
  ctaHref?: string | null
}

export function MobileMenu({ navItems, ctaLabel, ctaHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-600"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col gap-4">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-navy"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {ctaLabel && ctaHref && (
              <Link
                href={ctaHref}
                className="rounded-lg bg-indigo px-4 py-2 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
