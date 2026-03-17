import Link from 'next/link'
import Image from 'next/image'

interface HeroBlockProps {
  headline: string
  subheadline?: string | null
  cta_label?: string | null
  cta_href?: string | null
  image?: {
    url: string
    alt: string
    width: number
    height: number
  } | null
}

export function HeroBlock({ headline, subheadline, cta_label, cta_href, image }: HeroBlockProps) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
              {headline}
            </h1>
            {subheadline && (
              <p className="mt-6 text-lg text-accent-light md:text-xl">
                {subheadline}
              </p>
            )}
            {cta_label && cta_href && (
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={cta_href}
                  className="rounded bg-accent-dark px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-accent"
                >
                  {cta_label}
                </Link>
              </div>
            )}
          </div>
          {image?.url && (
            <div className="relative">
              <Image
                src={image.url}
                alt={image.alt || ''}
                width={image.width || 800}
                height={image.height || 450}
                priority
                className="rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
