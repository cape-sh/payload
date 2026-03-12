import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { MobileMenu } from './MobileMenu'

export async function Nav() {
  const payload = await getPayload()
  const navigation = await payload.findGlobal({ slug: 'navigation' })

  const navItems = navigation?.nav_items ?? []
  const ctaLabel = navigation?.cta_label
  const ctaHref = navigation?.cta_href

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-navy">
          CAEPE
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="rounded-lg bg-indigo px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-light"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <MobileMenu navItems={navItems} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </nav>
    </header>
  )
}
