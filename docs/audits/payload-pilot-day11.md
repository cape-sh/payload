# Lighthouse Audit — Payload Pilot Day 11

**Date:** 2026-03-24
**Preview URL:** https://payload-three-phi.vercel.app
**Tool:** Lighthouse 13.0.3 (CLI, headless Chrome, default throttling — simulated slow 4G)

## Results

| Page | Performance | Accessibility | SEO | LCP | TBT | CLS |
|------|------------|---------------|-----|-----|-----|-----|
| / (homepage) | 80 | 100 | 100 | 4.6s | 90ms | 0 |
| /features | 96 | 100 | 100 | 2.7s | 50ms | 0 |
| /pricing | 94 | 100 | 100 | 2.9s | 110ms | 0 |
| /test-drive | 95 | 100 | 100 | 2.8s | 120ms | 0 |
| /resources | 92 | 100 | 100 | 2.5s | 250ms | 0 |
| /docs | 95 | 100 | 100 | — | — | — |

## Summary

- **Accessibility: 100 on all 6 pages** (target: >= 90) — PASS
- **SEO: 100 on all 6 pages** (target: 100) — PASS
- **Performance: 5/6 pages >= 90** (target: >= 90) — PARTIAL PASS
- **CLS: 0 on all pages** — no layout shift issues

## Homepage Performance (80) — Analysis

The homepage is the only page below the 90 target. Root cause:

1. **LCP 4.6s** — The LCP element is the hero text block. Under Lighthouse's simulated slow 4G (1.6 Mbps), the initial JS bundle (~140KB first-load shared) takes time to download and parse.
2. **Client-side carousel** — The `UseCaseCarouselBlock` is a `'use client'` component requiring hydration. This adds ~90ms TBT.
3. **Legacy JavaScript insight** — Next.js framework bundles contain some legacy polyfills. Not controllable without ejecting from the framework.

**Mitigation options (post-pilot):**
- Consider server-rendering the carousel as a CSS-only solution (removes hydration cost)
- Lazy-load the carousel section (below the fold)
- These are optimization refinements, not blockers for the pilot

## Fixes Applied (Day 11)

### Accessibility fixes (commit 2acf135)
- **Heading order:** Changed footer `h4`, carousel `h3`, pricing `h5`, feature grid `h3`, card grid `h3` to `p` tags — these are visual labels, not document structure headings
- **Color contrast:** Swapped `bg-accent` (#34A3D3, 2.87:1 contrast) to `bg-accent-dark` (#1F6390, 6.47:1 contrast) on all interactive buttons and links
- **Touch targets:** Increased carousel dot buttons from 10px to 24px (inner dot remains 10px visual size)

### Before/After

| Metric | Before fixes | After fixes |
|--------|-------------|-------------|
| Homepage A11y | 94 | 100 |
| Features A11y | 100 | 100 |
| Pricing A11y | 94 | 100 |
| Test-drive A11y | 95 | 100 |
| Resources A11y | 98 | 100 |
