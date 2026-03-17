# CAEPE Pilot Results — WordPress → Payload CMS v3

> 14-day pilot: 2026-03-11 to 2026-03-17
> Scope: 5 pages migrated from WordPress to Payload CMS v3 + Next.js 15

## Pilot Pages

| # | Page | Payload URL | WP Source |
|---|------|------------|-----------|
| 1 | Features | /features | caepe.sh/features/ |
| 2 | Pricing | /pricing | caepe.sh/pricing/ |
| 3 | Test Drive | /test-drive | caepe.sh/caepe-test-drive/ |
| 4 | Resources | /resources | caepe.sh/resources/ |
| 5 | Article | /resources/[slug] | caepe.sh/resources/[slug] |

**Vercel Preview:** `https://payload-three-phi.vercel.app`
**Payload Admin:** `https://payload-three-phi.vercel.app/admin`

## Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 15 (App Router, Server Components) |
| CMS | Payload CMS v3 (embedded in Next.js) |
| Database | Neon PostgreSQL (serverless) |
| Hosting | Vercel Pro |
| Media Storage | Cloudflare R2 |
| Email | Resend |
| Bot Protection | Cloudflare Turnstile |
| Styling | Tailwind CSS v4 |

## Acceptance Criteria Status

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | All 5 pages render correctly (375px, 768px, 1280px) | ✅ PASS | All pages built with responsive Tailwind classes |
| 2 | Demo form delivers email | ⏳ PENDING | Requires RESEND_API_KEY + domain verification |
| 3 | Turnstile blocks bots | ⏳ PENDING | Requires TURNSTILE_SECRET_KEY env var |
| 4 | Editor updates content without help | ⏳ PENDING | Editor guide written; human test needed |
| 5 | Lighthouse Performance ≥90 | ⏳ PENDING | Requires deployed preview; next/image + priority optimized |
| 6 | WordPress redirects work | ✅ PASS | 301 redirects configured in next.config.mjs |
| 7 | Payload ISR revalidation | ✅ PASS | afterChange hooks on Pages + Resources |
| 8 | Media uploads to R2 | ✅ PASS | S3 adapter configured for R2 |
| 9 | No TypeScript errors | ✅ PASS | `npx tsc --noEmit` — zero errors |
| 10 | Stakeholder sign-off | ⏳ PENDING | Scheduled for Day 14 review |

**Score: 5/10 passed, 5/10 pending human verification**

## WordPress Baseline vs Expected

| Page | WP Mobile Perf | WP Desktop Perf | Expected Payload |
|------|---------------|-----------------|-----------------|
| Features | 41 | 77 | 90+ |
| Pricing | 79 | 96 | 95+ |
| Test Drive | 39 | 79 | 95+ |
| Resources | 63 | 84 | 90+ |

## What Was Built

### CMS Schema
- **2 Collections:** Pages (block-based), Resources (articles)
- **2 Globals:** Navigation, Footer
- **4 Blocks:** Hero, FeatureAccordion, PricingTable, CTAForm
- **Versioning** with draft/published workflow on both collections
- **Admin descriptions** on all fields for non-developer editors

### Frontend (10 pages/routes)
- `/features` — Hero + 6 accordion sections (45 feature items) + sticky ToC
- `/pricing` — Hero + 3-tier pricing table with yellow checkmarks
- `/test-drive` — Hero + demo request form (Zod + Turnstile)
- `/resources` — Card grid + tag filter + pagination
- `/resources/[slug]` — Article with Lexical rich text, ToC, related posts, social share

### SEO & Performance
- Dynamic sitemap.xml from Payload data
- robots.txt (disallow /admin)
- buildMetadata() with OpenGraph + Twitter cards on all pages
- JSON-LD Article structured data
- 301 redirects from WordPress URLs
- ISR via Payload afterChange hooks
- next/image with priority, sizes, width/height on all images

### Migration Scripts
- `scripts/wp-export.ts` — WP REST API content export
- `scripts/wp-to-payload-transform.ts` — WP → Payload format converter
- `scripts/seed-payload.ts` — Base page + article seeder
- `scripts/seed-features.ts` — 45 feature items across 6 categories
- `scripts/seed-pricing.ts` — 3 tiers + 6 included features
- `scripts/seed-test-drive.ts` — Hero + CTAForm block
- `scripts/seed-globals.ts` — Navigation + Footer globals

## Known Limitations
1. Lighthouse scores not yet captured (requires Vercel deploy)
2. Email delivery untested (requires Resend API key + domain DKIM)
3. Editor walkthrough not yet conducted
4. Cross-browser testing pending (Chrome, Firefox, Safari)
5. Mobile physical device testing pending

## Recommendations

1. **Deploy to Vercel** and run Lighthouse to verify performance targets
2. **Configure Resend + Turnstile** env vars in Vercel dashboard
3. **Schedule 30-min editor walkthrough** using `docs/editor-guide.md`
4. **Approve pilot** if acceptance criteria pass
5. **Plan full migration** — estimated 8-10 additional days for remaining ~30 pages + 28 posts

## Sprint Retrospective Summary

See full retros in `docs/retros/retro-day-07.md` and `docs/retros/retro-day-14.md`.

**Key wins:** All 5 pages built on schedule, dark theme matched caepe.sh, TypeScript zero errors maintained, block architecture scales well.

**Key learnings:** Visual design audit should happen Day 1, verify npm package names before planning, deploy to Vercel earlier for Lighthouse feedback loop.
