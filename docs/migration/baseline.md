# WordPress Baseline — Lighthouse Scores

> Captured: 2026-03-12 (Day 3)
> Source: Live caepe.sh WordPress site
> Tool: Google PageSpeed Insights (Lighthouse)

## Baseline Scores — Mobile

| Page | URL | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| Features | caepe.sh/features/ | 79 | 92 | 96 | 100 |
| Pricing | caepe.sh/pricing/ | 61 | 91 | 96 | 100 |
| Test Drive | caepe.sh/caepe-test-drive/ | 39 | 92 | 92 | 100 |
| Resources | caepe.sh/resources/ | 61 | 87 | 96 | 100 |
| Article | caepe.sh/caepe-mcp-server/ | ___ | ___ | ___ | ___ |

**Mobile average: Performance 60, Accessibility 91, Best Practices 95, SEO 100**

## Baseline Scores — Desktop

| Page | URL | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| Features | caepe.sh/features/ | 96 | 93 | 96 | 100 |
| Pricing | caepe.sh/pricing/ | 93 | 91 | 96 | 100 |
| Test Drive | caepe.sh/caepe-test-drive/ | 80 | 92 | 96 | 100 |
| Resources | caepe.sh/resources/ | 66 | 88 | 96 | 100 |
| Article | caepe.sh/caepe-mcp-server/ | ___ | ___ | ___ | ___ |

**Desktop average: Performance 84, Accessibility 91, Best Practices 96, SEO 100**

## Key Metrics — Mobile

| Metric | Features | Pricing | Test Drive | Resources |
|---|---|---|---|---|
| FCP | 3.2s | 3.3s | 5.0s | 3.4s |
| LCP | 3.4s | 7.2s | 9.9s | 8.7s |
| TBT | 260ms | 270ms | 850ms | 200ms |
| CLS | 0 | 0 | 0 | 0 |
| Speed Index | 4.3s | 5.0s | 6.9s | 5.8s |

## Key Metrics — Desktop

| Metric | Features | Pricing | Test Drive | Resources |
|---|---|---|---|---|
| FCP | 0.8s | 0.8s | 0.7s | 0.7s |
| LCP | 0.8s | 0.8s | 1.2s | 1.8s |
| TBT | 150ms | 190ms | 340ms | 70ms |
| CLS | 0.029 | 0 | 0.046 | 0.811 |
| Speed Index | — | 1.2s | 1.5s | 1.5s |

## Payload Targets

| Metric | Target | Rationale |
|---|---|---|
| Performance (mobile) | >= 90 | +30 points over WP avg of 60 |
| Accessibility | >= 90 | Maintain/improve WP baseline |
| SEO | 100 | Maintain perfect score |
| FCP (mobile) | < 1.5s | Eliminate third-party render-blocking scripts |
| LCP (mobile) | < 2.5s | next/image priority + SSR + edge caching |
| TBT (mobile) | < 200ms | Server Components = near-zero client JS |
| CLS | < 0.1 | Explicit image dimensions via next/image |

## Key Findings

- **Test Drive mobile is worst performer** (39) — LCP 9.9s and TBT 850ms from heavy Stackable blocks + form scripts.
- **Resources desktop has CLS 0.811** — massive layout shift from lazy-loaded card images without dimensions.
- **Mobile LCP is the #1 bottleneck** across all pages (3.4s–9.9s) — driven by render-blocking CSS/JS from Stackable, Astra theme, Google Fonts.
- **SEO is already perfect** (100 across all pages) — must maintain this.
- Payload/Next.js should eliminate ~40 third-party requests and deliver Server-rendered HTML with near-zero client JS.
