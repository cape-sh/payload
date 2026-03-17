import Link from 'next/link'

interface Card {
  title: string
  description?: string | null
  id?: string
}

interface CardGridBlockProps {
  eyebrow?: string | null
  headline?: string | null
  cards?: Card[] | null
  cta_label?: string | null
  cta_href?: string | null
}

export function CardGridBlock({ eyebrow, headline, cards, cta_label, cta_href }: CardGridBlockProps) {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {(eyebrow || headline) && (
          <div className="mb-12 text-center">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">{headline}</h2>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(cards ?? []).map((card, i) => (
            <div
              key={card.id ?? i}
              className="rounded-lg border border-dark-light bg-dark-light p-6"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-accent/10 text-sm font-bold text-accent">
                {i + 1}
              </div>
              <h3 className="font-semibold text-white">{card.title}</h3>
              {card.description && (
                <p className="mt-2 text-sm text-accent-light">{card.description}</p>
              )}
            </div>
          ))}
        </div>

        {cta_label && cta_href && (
          <div className="mt-10 text-center">
            <Link
              href={cta_href}
              className="inline-flex items-center gap-2 rounded bg-accent-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              {cta_label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
