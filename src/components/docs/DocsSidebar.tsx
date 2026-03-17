'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import navData from '@/lib/docs/nav.json'

interface NavItem {
  title: string
  slug?: string
  children?: NavItem[]
}

interface DocsSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

function getItemHref(item: NavItem): string {
  if (item.slug === undefined) return '#'
  if (item.slug === '') return '/docs'
  return `/docs/${item.slug}`
}

function containsActiveSlug(item: NavItem, currentSlug: string): boolean {
  if (item.slug === currentSlug) return true
  if (item.children) return item.children.some(c => containsActiveSlug(c, currentSlug))
  return false
}

function NavItemComponent({ item, currentSlug, depth = 0 }: { item: NavItem; currentSlug: string; depth?: number }) {
  const isActive = item.slug === currentSlug
  const hasChildren = item.children && item.children.length > 0
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (hasChildren && containsActiveSlug(item, currentSlug)) {
      setIsExpanded(true)
    }
  }, [currentSlug, hasChildren, item])

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-dark-light hover:text-white ${
            isExpanded ? 'text-white' : 'text-accent-light'
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          <span>{item.title}</span>
          <svg
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {isExpanded && (
          <ul className="mt-0.5">
            {item.children!.map((child, i) => (
              <NavItemComponent key={child.slug ?? i} item={child} currentSlug={currentSlug} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <Link
        href={getItemHref(item)}
        className={`block rounded px-3 py-1.5 text-sm transition-colors ${
          isActive
            ? 'bg-accent/10 font-medium text-accent'
            : 'text-accent-light hover:bg-dark-light hover:text-white'
        }`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {item.title}
      </Link>
    </li>
  )
}

export function DocsSidebar({ isOpen, onClose }: DocsSidebarProps) {
  const pathname = usePathname()
  const currentSlug = pathname.replace(/^\/docs\/?/, '') || ''

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 overflow-y-auto border-r border-dark-light bg-dark p-4 pt-20 transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:border-r-0 lg:pt-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav>
          <ul className="space-y-0.5">
            {(navData as NavItem[]).map((item, i) => (
              <NavItemComponent key={item.slug ?? i} item={item} currentSlug={currentSlug} />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
