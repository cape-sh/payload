# CAEPE Marketing Site

WordPress → Payload CMS v3 migration pilot. Next.js 15 + Payload CMS v3 + Neon PostgreSQL + Vercel + Cloudflare R2.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel (Hosting)                     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)              │  │
│  │                                                   │  │
│  │  ┌─────────────────┐  ┌───────────────────────┐  │  │
│  │  │   (frontend)    │  │      (payload)        │  │  │
│  │  │                 │  │                       │  │  │
│  │  │  /features      │  │  /admin panel         │  │  │
│  │  │  /pricing       │  │  Collections CRUD     │  │  │
│  │  │  /test-drive    │  │  Global config        │  │  │
│  │  │  /resources     │  │  Draft/Publish        │  │  │
│  │  │  /resources/:id │  │  Version history      │  │  │
│  │  └────────┬────────┘  └───────────┬───────────┘  │  │
│  │           │                       │              │  │
│  │           └───────┐   ┌───────────┘              │  │
│  │                   ▼   ▼                          │  │
│  │          ┌─────────────────────┐                 │  │
│  │          │  Payload Local API  │                 │  │
│  │          │  (same Node process,│                 │  │
│  │          │   zero latency)     │                 │  │
│  │          └─────────┬───────────┘                 │  │
│  │                    │                             │  │
│  └────────────────────┼─────────────────────────────┘  │
│                       │                                 │
└───────────────────────┼─────────────────────────────────┘
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
   ┌───────────────┐        ┌───────────────┐
   │     Neon      │        │ Cloudflare R2 │
   │  PostgreSQL   │        │  (S3-compat)  │
   │  (serverless) │        │               │
   │               │        │  Media files  │
   │  Collections  │        │  thumbnail    │
   │  Globals      │        │  card (800px) │
   │  Versions     │        │  hero (1600px)│
   └───────────────┘        └───────────────┘
```

**Key design decision:** Payload CMS v3 runs embedded inside Next.js — one codebase, one deployment, one `npm run dev`. No separate CMS service, no HTTP API calls for content, full TypeScript type safety end-to-end.

## Pilot Pages

| # | Route | Description | Blocks |
|---|-------|-------------|--------|
| 1 | `/features` | Feature overview with 6 accordion sections (45 items) + sticky ToC | Hero, FeatureAccordion |
| 2 | `/pricing` | 3-tier pricing table with included features | Hero, PricingTable |
| 3 | `/test-drive` | Lead capture form with Turnstile bot protection | Hero, CTAForm |
| 4 | `/resources` | Article index with tag filter + pagination | Collection query |
| 5 | `/resources/[slug]` | Article template with ToC, related posts, social share | Lexical rich text |

## Project Structure

```
src/
├── app/
│   ├── (frontend)/              # Public-facing pages
│   │   ├── layout.tsx           # Root layout: Inter font, Nav, Footer, dark theme
│   │   ├── globals.css          # Tailwind v4 + brand tokens (dark theme)
│   │   ├── features/page.tsx    # /features — accordion sections + sticky ToC
│   │   ├── pricing/page.tsx     # /pricing — 3-tier pricing table
│   │   ├── test-drive/page.tsx  # /test-drive — demo request form
│   │   ├── resources/page.tsx   # /resources — card grid + tag filter + pagination
│   │   └── resources/[slug]/    # /resources/:slug — article template
│   ├── (payload)/               # Payload admin panel (auto-generated)
│   ├── api/contact/route.ts     # POST handler: Zod + Turnstile + Resend email
│   ├── sitemap.ts               # Dynamic sitemap from Payload data
│   └── robots.ts                # Disallow /admin, /api
├── payload/
│   ├── collections/
│   │   ├── Pages.ts             # Marketing pages — block-based layout, versioned, ISR hook
│   │   └── Resources.ts         # Articles — richText, tags, related posts, versioned
│   ├── globals/
│   │   ├── Navigation.ts        # Header nav items + CTA button
│   │   └── Footer.ts            # Footer link groups + social URLs
│   └── blocks/
│       ├── Hero.ts              # Headline, subheadline, CTA, image
│       ├── FeatureAccordion.ts  # Section label, title, feature items array
│       ├── PricingTable.ts      # Tiers, included features, footnote
│       └── CTAForm.ts           # Headline, form_id (demo-request/contact/newsletter)
├── components/
│   ├── layout/
│   │   ├── Nav.tsx              # Sticky header, responsive, mobile hamburger
│   │   ├── MobileMenu.tsx       # Client Component — hamburger toggle
│   │   └── Footer.tsx           # Link groups, social icons
│   ├── blocks/
│   │   ├── BlockRenderer.tsx    # Switch on blockType → component
│   │   ├── HeroBlock.tsx        # Hero section
│   │   ├── FeatureAccordionBlock.tsx  # Expandable accordion with feature cards
│   │   ├── FeaturesToC.tsx      # Sticky table of contents with scroll-spy
│   │   ├── PricingTableBlock.tsx # Pricing tiers with yellow checkmarks
│   │   └── CTAFormBlock.tsx     # Form block wrapper
│   ├── forms/
│   │   └── DemoRequestForm.tsx  # React Hook Form + Zod + Turnstile
│   ├── resources/
│   │   ├── ResourceCard.tsx     # Article card (image, tag, title, excerpt, meta)
│   │   ├── TagFilter.tsx        # Clickable tag pills
│   │   └── Pagination.tsx       # Previous/Next navigation
│   └── article/
│       ├── ArticleHeader.tsx    # Tags, title, author, date, hero image
│       ├── ArticleBody.tsx      # Lexical rich text with prose-invert
│       ├── TableOfContents.tsx  # Sticky sidebar with scroll-spy
│       ├── RelatedPosts.tsx     # 3-card related articles grid
│       └── SocialShare.tsx      # X/Twitter, LinkedIn, copy link
├── lib/
│   ├── payload.ts               # getPayload() singleton helper
│   └── metadata.ts              # buildMetadata() — OG, Twitter, canonical
└── payload-types.ts             # Auto-generated TypeScript types

scripts/
├── wp-export.ts                 # Fetch WP content via REST API
├── wp-to-payload-transform.ts   # Transform WP → Payload seed format
├── seed-payload.ts              # Seed pages + article via Payload Local API
├── seed-features.ts             # Seed features page (6 sections, 45 items)
├── seed-pricing.ts              # Seed pricing page (3 tiers, 6 features)
├── seed-test-drive.ts           # Seed test-drive page (Hero + CTAForm)
└── seed-globals.ts              # Seed Navigation + Footer globals

docs/
├── adr/ADR-001-stack.md         # Architecture Decision Record
├── audits/                      # Lighthouse audit results
├── migration/baseline.md        # WP baseline Lighthouse scores
├── standups/                    # Daily standup logs
├── retros/                      # Mid-sprint + end-of-sprint retrospectives
├── editor-guide.md              # Non-developer editor guide
└── pilot-results.md             # Final pilot results report
```

## Data Model

### Collections

| Collection | Purpose | Key fields |
|---|---|---|
| **Pages** | Marketing pages built from blocks | title, slug, layout (blocks[]), meta (SEO), versions |
| **Resources** | Articles and guides | title, slug, excerpt, content (Lexical), tags, author, related_posts, versions |
| **Media** | Images and files on R2 | alt, sizes (thumbnail 400px, card 800px, hero 1600px) |
| **Users** | Admin/editor auth | email, password, role |

### Globals

| Global | Purpose | Key fields |
|---|---|---|
| **Navigation** | Site header | nav_items[], cta_label, cta_href |
| **Footer** | Site footer | link_groups[], social_github, social_linkedin, social_twitter |

### Blocks

| Block | Used on | Fields |
|---|---|---|
| **Hero** | All pages | headline, subheadline, cta_label, cta_href, image |
| **FeatureAccordion** | /features | section_label, section_title, items[] (name, description) |
| **PricingTable** | /pricing | headline, tiers[] (name, price, suffix, CTA), included_features[], footnote |
| **CTAForm** | /test-drive | headline, subheadline, form_id (demo-request/contact/newsletter) |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| CMS | Payload CMS v3 (embedded) |
| Database | Neon PostgreSQL (serverless) |
| Hosting | Vercel Pro |
| Media storage | Cloudflare R2 (S3-compatible, zero egress) |
| Styling | Tailwind CSS v4 (dark theme) |
| Font | Inter (next/font/google) |
| Rich text | Lexical (Payload built-in) |
| Forms | React Hook Form + Zod |
| Bot protection | Cloudflare Turnstile |
| Email | Resend |

## Brand Tokens (Dark Theme)

| Token | Hex | Usage |
|---|---|---|
| Dark | `#1F2325` | Page background |
| Dark Light | `#2A2D2F` | Cards, hover states, borders |
| Accent | `#34A3D3` | Primary blue/cyan accent |
| Accent Dark | `#1F6390` | CTA buttons |
| Accent Light | `#96C6E2` | Secondary text |
| Green | `#58AB62` | Success states |
| Yellow | `#F8E224` | Pricing checkmarks |

## Development

```bash
npm run dev          # Start Next.js + Payload (localhost:3000)
npm run build        # Production build
npx tsc --noEmit     # Type check (zero errors required)
npx payload generate:types      # Regenerate payload-types.ts
npx payload generate:importmap  # Regenerate admin import map
```

### Seed data

```bash
npx tsx scripts/seed-payload.ts      # Base pages + article
npx tsx scripts/seed-features.ts     # Features page (45 items)
npx tsx scripts/seed-pricing.ts      # Pricing page (3 tiers)
npx tsx scripts/seed-test-drive.ts   # Test-drive page
npx tsx scripts/seed-globals.ts      # Navigation + Footer
```

### URLs

- Frontend: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`
- Vercel preview: `https://payload-three-phi.vercel.app`

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values. See `CLAUDE.md` for the full variable reference.

Required for local dev: `DATABASE_URI`, `PAYLOAD_SECRET`, `CLOUDFLARE_R2_*`, `NEXT_PUBLIC_R2_PUBLIC_URL`.

Required for forms: `RESEND_API_KEY`, `CONTACT_FORM_TO`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

## SEO

- Dynamic `sitemap.xml` generated from all published Pages + Resources
- `robots.txt` allows all crawlers, disallows `/admin` and `/api`
- `buildMetadata()` applies OpenGraph + Twitter cards + canonical URLs to all pages
- JSON-LD Article structured data on `/resources/[slug]`
- 301 redirects from WordPress URLs (`/features/`, `/caepe-test-drive/`, `/wp-admin/*`, etc.)
- ISR via Payload `afterChange` hooks — content updates propagate within seconds
