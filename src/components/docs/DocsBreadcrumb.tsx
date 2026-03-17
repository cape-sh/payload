import Link from 'next/link'
import navData from '@/lib/docs/nav.json'

interface NavItem {
  title: string
  slug?: string
  children?: NavItem[]
}

function findBreadcrumbTrail(items: NavItem[], targetSlug: string, trail: NavItem[] = []): NavItem[] | null {
  for (const item of items) {
    if (item.slug === targetSlug) {
      return [...trail, item]
    }
    if (item.children) {
      const found = findBreadcrumbTrail(item.children, targetSlug, [...trail, item])
      if (found) return found
    }
  }
  return null
}

export function DocsBreadcrumb({ slug }: { slug: string }) {
  const trail = findBreadcrumbTrail(navData as NavItem[], slug)
  if (!trail || trail.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-accent-light/70">
        <li>
          <Link href="/docs" className="hover:text-accent-light">Docs</Link>
        </li>
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="text-accent-light/40">/</span>
            {i === trail.length - 1 ? (
              <span className="text-accent-light">{item.title}</span>
            ) : (
              <span>{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
