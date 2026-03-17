'use client'

import { useState } from 'react'
import { DocsSidebar } from './DocsSidebar'

interface DocsLayoutProps {
  children: React.ReactNode
  toc?: React.ReactNode
}

export function DocsLayout({ children, toc }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="mx-auto flex max-w-[1400px]">
      <DocsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0 flex-1 px-4 py-8 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mb-4 flex items-center gap-2 rounded bg-dark-light px-3 py-2 text-sm text-accent-light lg:hidden"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menu
        </button>

        {children}
      </div>

      {toc && (
        <div className="hidden w-[250px] shrink-0 xl:block">
          <div className="sticky top-20 py-8 pr-4">
            {toc}
          </div>
        </div>
      )}
    </div>
  )
}
