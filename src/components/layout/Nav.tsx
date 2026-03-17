import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { MobileMenu } from './MobileMenu'

export async function Nav() {
  const payload = await getPayload()
  const navigation = await payload.findGlobal({ slug: 'navigation' })

  const navItems = navigation?.nav_items ?? []
  const ctaLabel = navigation?.cta_label
  const ctaHref = navigation?.cta_href

  return (
    <header className="sticky top-0 z-50 border-b border-dark-light bg-dark/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Image
            src="/images/caepe-icon.png"
            alt="CAEPE"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          CAEPE
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="text-sm font-medium text-accent-light transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="rounded bg-accent-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
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
