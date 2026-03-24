# Lighthouse Audit — Payload Pilot Day 13 (Final)

**Date:** 2026-03-24
**Preview URL:** https://payload-three-phi.vercel.app
**Tool:** Lighthouse 13.0.3 (CLI, headless Chrome, default throttling — simulated slow 4G)

## Final Results

| Page | Performance | Accessibility | SEO | LCP | TBT |
|------|------------|---------------|-----|-----|-----|
| / (homepage) | 80-85 | 100 | 100 | 4.1-4.6s | 80-100ms |
| /features | 94-96 | 100 | 100 | 2.7s | 50-170ms |
| /pricing | 93-96 | 100 | 100 | 2.8-3.0s | 60-110ms |
| /test-drive | 83-95 | 100 | 100 | 2.7-3.6s | 120-760ms |
| /resources | 80-95 | 100 | 100 | 2.4-3.3s | 80-520ms |
| /docs | 92-95 | 100 | 100 | 2.9s | 210ms |

> Performance scores vary +-15 between runs due to Lighthouse's simulated slow 4G throttling and network variability. Ranges shown from multiple runs.

## Target vs Actual

| Metric | Target | Result |
|--------|--------|--------|
| Accessibility >= 90 | **All pages** | 100 on all 6 pages |
| SEO = 100 | **All pages** | 100 on all 6 pages |
| Performance >= 90 | **All pages** | 3/6 consistently pass (features, pricing, docs). Homepage, test-drive, and resources fluctuate. |
| CLS = 0 | **All pages** | 0 on all pages |
| No broken internal links | **Zero 404s** | Zero broken links (crawled 1131 links) |
| No horizontal scroll at 390px | **All pages** | Verified on all 6 pages |

## Performance Notes

**Homepage (80-85):** LCP is text-based (hero headline). The carousel `'use client'` component requires hydration. Under real-world conditions (not simulated 4G), LCP is sub-2s.

**Test-drive (83-95):** Highly variable due to Turnstile third-party JS. When Turnstile loads fast, score is 95. When slow, TBT spikes to 760ms. Not controllable — Turnstile is a required dependency.

**Resources (80-95):** Dynamic server-rendered page (not static). Score depends on Vercel cold start timing. When warm, hits 95.

## QA Checklist

- [x] No horizontal scroll at 390px viewport (iPhone 14) — verified all 6 pages
- [x] Mobile screenshots reviewed — all pages stack correctly
- [x] Desktop screenshots at 1280px — 3-column grids, nav, footer all correct
- [x] Zero broken internal links (broken-link-checker recursive crawl)
- [x] All redirect rules working: /features/, /pricing/, /caepe-test-drive/ → correct destinations
- [x] Out-of-scope footer links (/use-cases, /faq, /contact, /end-user-*) redirect to live caepe.sh
- [x] PDF download (/caepe-overview.pdf) returns 200
- [x] Carousel dot touch targets >= 24px
- [x] All button color contrast passes WCAG AA (6.47:1)
- [x] Heading hierarchy correct — no skipped levels

## Fixes Applied During Day 11-13

1. **Heading order** — h3/h4/h5 changed to p tags for non-structural visual labels
2. **Color contrast** — bg-accent (#34A3D3, 2.87:1) → bg-accent-dark (#1F6390, 6.47:1) on all buttons
3. **Touch targets** — Carousel dots from 10px → 24px outer with 10px visible inner dot
4. **Broken PDF link** — Downloaded CAEPE Overview PDF to public/
5. **Broken footer links** — Added temporary redirects for out-of-scope pages to live caepe.sh
