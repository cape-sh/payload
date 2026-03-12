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
│  │  │  Public pages   │  │  /admin panel         │  │  │
│  │  │  Nav + Footer   │  │  Collections CRUD     │  │  │
│  │  │  Block renderer │  │  Global config        │  │  │
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

## Project Structure

```
src/
├── app/
│   ├── (frontend)/              # Public-facing pages
│   │   ├── layout.tsx           # Root layout: Inter font, Nav, Footer, Tailwind
│   │   ├── globals.css          # Tailwind v4 + brand tokens
│   │   └── page.tsx             # Homepage
│   └── (payload)/               # Payload admin panel (auto-generated)
│       └── admin/[[...segments]]/
├── collections/
│   ├── Users.ts                 # Auth users (Payload built-in)
│   └── Media.ts                 # Images/files → Cloudflare R2 (thumbnail/card/hero sizes)
├── payload/
│   ├── collections/
│   │   ├── Pages.ts             # Marketing pages — block-based layout, versioned, ISR hook
│   │   └── Resources.ts        # Articles — richText, tags, related posts, versioned
│   ├── globals/
│   │   ├── Navigation.ts       # Header nav items + CTA button
│   │   └── Footer.ts           # Footer link groups + social URLs
│   └── blocks/                  # (Day 4+) Hero, FeatureAccordion, PricingTable, CTAForm
├── components/
│   ├── layout/
│   │   ├── Nav.tsx              # Sticky header, responsive, mobile hamburger (Server Component)
│   │   ├── MobileMenu.tsx       # Client Component — hamburger toggle
│   │   └── Footer.tsx           # Link groups, social icons (Server Component)
│   ├── blocks/                  # (Day 4+) Block renderers
│   └── ui/                      # (Day 4+) Button, Card, Badge primitives
├── lib/
│   └── payload.ts               # getPayload() singleton helper
├── payload.config.ts            # Payload config: collections, globals, DB, plugins
└── payload-types.ts             # Auto-generated TypeScript types
```

## Data Model

### Collections (database tables)

| Collection | Purpose | Key fields |
|---|---|---|
| **Pages** | Marketing pages built from blocks | title, slug, layout (blocks[]), meta (SEO), versions |
| **Resources** | Articles and guides | title, slug, excerpt, content (Lexical), tags, author, related_posts, versions |
| **Media** | Images and files on R2 | alt, sizes (thumbnail 400px, card 800px, hero 1600px) |
| **Users** | Admin/editor auth | email, password, role |

### Globals (singletons)

| Global | Purpose | Key fields |
|---|---|---|
| **Navigation** | Site header | nav_items[], cta_label, cta_href |
| **Footer** | Site footer | link_groups[], social_github, social_linkedin, social_twitter |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| CMS | Payload CMS v3 (embedded) |
| Database | Neon PostgreSQL (serverless) |
| Hosting | Vercel Pro |
| Media storage | Cloudflare R2 (S3-compatible, zero egress) |
| Styling | Tailwind CSS v4 |
| Font | Inter (next/font/google) |
| Rich text | Lexical (Payload built-in) |

## Brand Tokens

| Token | Hex | Usage |
|---|---|---|
| Navy | `#0F172A` | Backgrounds, body text |
| Indigo | `#6366F1` | Primary actions, accents |
| Cyan | `#22D3EE` | Secondary accents |

## Development

```bash
npm run dev          # Start Next.js + Payload (localhost:3000)
npm run build        # Production build
npx tsc --noEmit     # Type check
npx payload generate:types      # Regenerate payload-types.ts
npx payload generate:importmap  # Regenerate admin import map
```

Admin panel: `http://localhost:3000/admin`

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values. See `CLAUDE.md` for the full variable reference.

Required for local dev: `DATABASE_URI`, `PAYLOAD_SECRET`, `CLOUDFLARE_R2_*`, `NEXT_PUBLIC_R2_PUBLIC_URL`.
