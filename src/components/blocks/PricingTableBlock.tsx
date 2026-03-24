import Link from 'next/link'

interface Tier {
  tier_name: string
  price: string
  price_suffix?: string | null
  highlight?: boolean | null
  cta_label?: string | null
  cta_href?: string | null
  id?: string
}

interface IncludedFeature {
  feature: string
  id?: string
}

interface PricingTableBlockProps {
  headline?: string | null
  subheadline?: string | null
  included_features?: IncludedFeature[] | null
  tiers?: Tier[] | null
  footnote?: string | null
}

export function PricingTableBlock({
  headline,
  subheadline,
  included_features,
  tiers,
  footnote,
}: PricingTableBlockProps) {
  const isCustomPrice = (price: string) => {
    return price.toLowerCase() === 'custom' || isNaN(parseFloat(price))
  }

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        {headline && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">{headline}</h2>
            {subheadline && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-light">{subheadline}</p>
            )}
          </div>
        )}

        {/* Included features */}
        {included_features && included_features.length > 0 && (
          <div className="mb-12 text-center">
            <p className="mb-6 text-lg font-medium text-accent-light">
              All CAEPE pricing plans come with:
            </p>
            <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3">
              {included_features.map((item, i) => (
                <div key={item.id ?? i} className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="shrink-0 text-yellow"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-accent-light">{item.feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {(tiers ?? []).map((tier, i) => (
            <div
              key={tier.id ?? i}
              className={`flex flex-col rounded-xl border-2 p-8 text-center ${
                tier.highlight
                  ? 'border-accent shadow-lg shadow-accent/10'
                  : 'border-dark-light'
              }`}
            >
              <p className="text-lg font-semibold text-white">{tier.tier_name}</p>

              <div className="my-6">
                {isCustomPrice(tier.price) ? (
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                ) : (
                  <>
                    <span className="text-lg text-accent-light">$</span>
                    <span className="text-5xl font-bold text-white">{tier.price}</span>
                  </>
                )}
              </div>

              {tier.price_suffix && (
                <p className="mb-6 text-sm text-accent-light">{tier.price_suffix}</p>
              )}

              <div className="mt-auto">
                {tier.cta_label && tier.cta_href && (
                  <Link
                    href={tier.cta_href}
                    className={`block rounded-lg px-6 py-3 text-center text-sm font-semibold transition-colors ${
                      tier.highlight
                        ? 'bg-accent-dark text-white hover:bg-accent'
                        : 'border border-dark-light text-white hover:border-accent hover:text-accent'
                    }`}
                  >
                    {tier.cta_label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        {footnote && (
          <p className="mt-8 text-center text-sm italic text-accent-light">{footnote}</p>
        )}
      </div>
    </section>
  )
}
