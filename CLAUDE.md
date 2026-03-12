# CAEPE.SH — Payload CMS v3 Migration Pilot

> 14-day pilot build: Next.js 15 + Payload CMS v3 + Neon PostgreSQL + Vercel Pro + Cloudflare R2
> Pilot scope: /features/ · /pricing/ · /caepe-test-drive/ · /resources/ · 1 article

## How to Use This File

This is a **Claude Code agent instruction file**. It defines the full 14-day pilot build plan. Each day specifies: the agent role to adopt, the exact files to create, and success criteria that must pass before proceeding to the next day. Check off success criteria as they are completed. Do not proceed to the next day until all criteria for the current day pass.

---

## Project Overview

Payload CMS v3 runs **embedded inside the Next.js application** — one codebase, one deployment, one `npm run dev`. There is no separate CMS service, no HTTP API calls for content, and full type safety end-to-end.

| Layer | Payload CMS v3 |
|---|---|
| Services | One: Next.js app embeds Payload as a plugin |
| Admin panel | `yourdomain.com/admin` — inside your Next.js app |
| Data fetching | Payload Local API — zero network latency, same Node process |
| Database | Your Neon PostgreSQL — 100% data ownership |
| Deployment | One Vercel project, one GitHub repo, one set of env vars |
| Dev workflow | `npm run dev` — starts Next.js + Payload together |

## Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **CMS:** Payload CMS v3 (embedded in Next.js)
- **Database:** Neon PostgreSQL (serverless)
- **Hosting:** Vercel Pro
- **Media storage:** Cloudflare R2 (zero-egress object storage)
- **Email:** Resend (transactional)
- **Bot protection:** Cloudflare Turnstile
- **UI:** Tailwind CSS, Radix UI (accordion), Shiki (syntax highlighting)
- **Font:** Inter (via next/font/google)

## Key Payload Concepts

- **Collections** = database tables (Pages, Resources, Media)
- **Globals** = singleton documents for site-wide config (Navigation, Footer)
- **Blocks** = reusable content sections assembled by editors in the admin panel (Hero, FeatureAccordion, PricingTable, CTAForm)
- **Local API** = `payload.find()`, `payload.create()` — same Node process, zero network latency, full TypeScript types
- Pages are built by adding and arranging blocks in the admin — no developer required for new pages after initial setup

## Project File Structure

```
caepe-web/
├── src/
│   ├── app/
│   │   ├── (frontend)/           # Next.js public pages
│   │   │   ├── features/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── test-drive/page.tsx
│   │   │   ├── resources/page.tsx        # Resources index
│   │   │   ├── resources/[slug]/page.tsx # Article template
│   │   │   ├── sitemap.ts
│   │   │   └── robots.ts
│   │   ├── (payload)/            # Payload admin (auto-generated)
│   │   │   └── admin/[[...segments]]/page.tsx
│   │   └── api/contact/route.ts  # Demo request form handler
│   ├── payload/
│   │   ├── collections/Pages.ts
│   │   ├── collections/Resources.ts
│   │   ├── collections/Media.ts
│   │   ├── globals/Navigation.ts
│   │   ├── globals/Footer.ts
│   │   └── blocks/               # Hero, FeatureAccordion, PricingTable, CTAForm
│   ├── components/
│   │   ├── layout/               # Nav.tsx, Footer.tsx
│   │   ├── blocks/               # One renderer per block type
│   │   └── ui/                   # Button, Card, Badge primitives
│   └── lib/
│       ├── payload.ts            # getPayload() singleton
│       └── metadata.ts           # generateMetadata() helper
├── scripts/
│   ├── wp-export.ts              # Fetch WP content via REST API
│   ├── wp-to-payload-transform.ts # Transform WP → Payload format
│   └── seed-payload.ts           # Seed Payload via Local API
├── docs/
│   ├── adr/ADR-001-stack.md      # Architecture Decision Record
│   ├── audits/                   # Lighthouse audit results
│   ├── migration/baseline.md     # WP baseline Lighthouse scores
│   ├── standups/                 # Daily standup logs (day-01.md ... day-14.md)
│   ├── retros/                   # Retrospectives (retro-day-07.md, retro-day-14.md)
│   ├── editor-guide.md           # Non-developer editor guide
│   └── pilot-results.md          # Final pilot results report
├── migration/
│   └── wp-export/                # Exported WP JSON files
├── payload.config.ts
├── next.config.ts
└── .env.local
```

## Coding Conventions

- **TypeScript:** Strict mode enabled. No `any` types — use proper interfaces for all Payload collection/block types.
- **Components:** Server Components by default. Only add `'use client'` when the component needs browser APIs (accordion toggle, form state, scroll-spy, clipboard).
- **Imports:** Use `@/` path alias for `src/` directory (e.g., `import { Nav } from '@/components/layout/Nav'`).
- **Naming:** PascalCase for components and types, camelCase for functions and variables, kebab-case for file names except React components.
- **Payload fields:** Use snake_case for all Payload field names (e.g., `meta_title`, `cta_href`, `feature_name`). This matches the source documents and keeps the database schema consistent.
- **Styling:** Tailwind CSS utility classes only — no CSS modules, no styled-components. Use the brand tokens defined in `tailwind.config.ts`.
- **Images:** Always use `next/image` — never raw `<img>` tags. Always include `alt`, `width`, `height`, and `sizes` props.
- **Data fetching:** Use Payload Local API (`payload.find()`, `payload.findByID()`) in Server Components — never use the REST API from the frontend.

## Guardrails — Do Not

- **Do not** install packages not listed in Day 1 without explicit approval
- **Do not** use the Payload REST API from frontend components — always use the Local API
- **Do not** skip success criteria — all must pass before proceeding to the next day
- **Do not** commit `.env.local` or any file containing secrets to Git
- **Do not** run `npm update` or `npx create-payload-app@latest` after Day 1 — pin all versions
- **Do not** use raw `<img>` tags — always use `next/image`
- **Do not** add `'use client'` to components that can remain Server Components
- **Do not** hardcode content that should be editable in Payload admin (the whole point is editor control)
- **Do not** action scope-creep requests during the pilot — capture as GitHub Issues tagged `post-pilot`

## Environment Variables

All variables must be set in `.env.local` locally AND in the Vercel dashboard for preview/production.

| Variable | Needed on | Value / Where to get it |
|---|---|---|
| `PAYLOAD_SECRET` | Day 1 | 32-char random string. Run: `openssl rand -base64 32` |
| `DATABASE_URI` | Day 1 | Neon dashboard → Connection string: `postgres://user:pass@host/db?sslmode=require` |
| `NEXT_PUBLIC_SITE_URL` | Day 1 | `https://caepe.sh` (prod) or `https://preview-xxx.vercel.app` (preview) |
| `CLOUDFLARE_R2_BUCKET` | Day 1 | R2 bucket name from Cloudflare dashboard |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | Day 1 | Cloudflare → R2 → Manage API tokens → Access Key ID |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | Day 1 | Cloudflare → R2 → Secret Access Key |
| `CLOUDFLARE_R2_ENDPOINT` | Day 1 | `https://[accountid].r2.cloudflarestorage.com` |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | Day 1 | Public delivery URL for media (custom domain or r2.dev URL) |
| `RESEND_API_KEY` | Day 7 | resend.com → API Keys → Create API key |
| `CONTACT_FORM_TO` | Day 7 | Destination inbox e.g. `team@biqmind.com` |
| `TURNSTILE_SECRET_KEY` | Day 7 | Cloudflare → Turnstile → Site → Secret key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Day 7 | Cloudflare → Turnstile → Site key (public) |

## Pilot Scope

| # | Live URL | New URL | Payload blocks / collections | What this validates |
|---|---|---|---|---|
| 1 | caepe.sh/features/ | /features | Pages + Hero + FeatureAccordion | Accordion/expandable sections; 40+ structured field items; editor control; PDF download; long-page TOC navigation |
| 2 | caepe.sh/pricing/ | /pricing | Pages + Hero + PricingTable | Pricing table with 3 structured tiers; feature checklist; CTA buttons; non-developer editable in admin |
| 3 | caepe.sh/caepe-test-drive/ | /test-drive | Pages + Hero + CTAForm + API route | Lead capture: demo form, Resend email delivery, Cloudflare Turnstile spam protection |
| 4 | caepe.sh/resources/ | /resources | Resources collection index | Collection-driven index; tag filtering; card grid; pagination; Payload query API |
| 5 | One article from /resources/ | /resources/[slug] | Resources collection single doc | Article template: Lexical rich text, TOC from structured JSON, author, date, related posts, social share |

## Brand Tokens

| Token | Value |
|---|---|
| Navy | `#0F172A` |
| Indigo | `#6366F1` |
| Cyan | `#22D3EE` |

---

## Agent Roles

| Agent | Active on days | Responsibilities |
|---|---|---|
| ARCHITECT | Day 1 | Project scaffold, payload.config.ts, Neon setup, R2 adapter, CI/CD pipeline, ADR-001 documentation |
| CMS ENGINEER | Day 2–9 | All Payload schemas (Collections, Globals, Blocks), admin descriptions, access control, afterChange ISR hooks, Payload admin data entry |
| FRONTEND ENGINEER | Day 2–9 | All React/Next.js components, Tailwind styling, Server Components, generateMetadata(), generateStaticParams(), BlockRenderer |
| MIGRATION ENGINEER | Day 3 | WP export scripts, transform scripts, Payload seed scripts, media upload, baseline metrics capture |
| PERFORMANCE & SEO | Day 10–11 | Lighthouse audits, next/image, ISR config, sitemap, robots.txt, redirects, JSON-LD structured data |
| QA ENGINEER | Day 11–13 | Cross-browser testing, mobile testing, broken link crawl, redirect verification, final Lighthouse run |
| DOCUMENTATION ENGINEER | Day 12, 14 | Editor guide, admin user setup, pilot results report, GitHub milestone |
| AGILE COACH | Daily | SDLC process management — daily standup, sprint tracking, Definition of Done enforcement, blocker escalation, scope control, risk register monitoring |
| RETRO AGENT | Day 7, 14 | Mid-sprint and end-of-sprint retrospectives — what went well, what didn't, what to change, lessons learned, velocity analysis, recommendations for full migration |

### AGILE COACH — Daily Standup Format

The AGILE COACH agent runs at the **start of every day** before any build work begins. Output the following to `docs/standups/day-NN.md`:

```
## Day NN Standup — [date]

### Yesterday
- [What was completed — reference success criteria that passed]

### Today
- [What is planned — reference day plan tasks]

### Blockers
- [Any blockers, or "None"]

### Risk Register Check
- [Any risks from the register that are materialising, or "All clear"]

### Sprint Progress
- Days completed: NN/14
- Pages delivered: N/5
- Success criteria passed: NN/NN total
- On track: YES / AT RISK / BLOCKED
```

### RETRO AGENT — Retrospective Format

The RETRO AGENT runs at **end of Day 7** (mid-sprint) and **end of Day 14** (end-of-sprint). Output to `docs/retros/retro-day-NN.md`:

```
## Retrospective — Day NN

### What Went Well
- [Specific wins — tasks completed ahead of schedule, clean implementations, etc.]

### What Didn't Go Well
- [Specific friction — tasks that took longer, blockers, unexpected issues]

### What To Change
- [Actionable improvements for the next sprint half / full migration]

### Velocity Analysis
- Planned tasks: NN
- Completed tasks: NN
- Carry-over tasks: NN (list them)
- Estimated vs actual effort per day: [table]

### Risk Register Update
- [Any new risks discovered during the sprint]
- [Any existing risks that should be re-graded]

### Recommendations
- [For mid-sprint: adjustments to Days 8-14]
- [For end-of-sprint: recommendations for the full migration phase]
```

---

## Day-by-Day Plan

### Day 1 — Project Scaffold + Infra Setup

**Agents:** ARCHITECT · AGILE COACH

**Human prerequisite (before Day 1):**
Create: (1) GitHub repo, (2) Neon account at neon.tech — new project, copy connection string, (3) Vercel account connected to GitHub repo, (4) Cloudflare account with R2 bucket named `caepe-media`. Paste values into `.env.local` using the env var table above.

**Claude Code — ARCHITECT agent:**
- Run: `npx create-payload-app@latest caepe-web` — select: TypeScript, PostgreSQL (Neon), blank template
- Install additional packages:
  - `npm install @payloadcms/storage-cloudflare-r2`
  - `npm install resend zod @hookform/resolvers react-hook-form`
  - `npm install @radix-ui/react-collapsible shiki`
- Add `DATABASE_URI` to `.env.local`. Run: `npm run payload migrate` — confirm Neon tables created
- Open `http://localhost:3000/admin` — create first admin user (**human task**, 2 min)
- Connect GitHub repo to Vercel. Add all env vars in Vercel dashboard. Trigger first deployment.
- Enable Neon GitHub integration for branch-per-PR database isolation
- Create `.github/workflows/ci.yml` — lint and `npx tsc --noEmit` on every PR
- Create `docs/adr/ADR-001-stack.md` — document why Payload v3 + Neon + Vercel + R2 was chosen

**Success criteria:**
- [x] `npm run dev` runs with no TypeScript errors — Payload admin at `http://localhost:3000/admin`
- [x] Vercel preview URL accessible in browser
- [x] Neon dashboard shows Payload-created tables

### Day 2 — Payload Schema + Design System

**Agents:** CMS ENGINEER · FRONTEND ENGINEER · AGILE COACH

**Claude Code — CMS ENGINEER agent:**
- Create `src/payload/collections/Pages.ts`:
  - Fields: title, slug (unique), layout (blocks array), meta (group: meta_title, meta_description, og_image), status (draft|published)
  - Versions: enabled — stores full version history
  - afterChange hook: calls `revalidatePath('/' + slug)` on publish
  - Access: Admin = all ops; Editor = create/read/update, no delete, no direct publish
- Create `src/payload/collections/Resources.ts`:
  - Fields: title, slug, excerpt, content (Lexical richText), feature_image (Media relation), author (text), publish_date, reading_time (number), tags (array of text), related_posts (hasMany Resources relation), status
  - Admin descriptions on every field for non-developer editors
- Create `src/payload/collections/Media.ts` — Cloudflare R2 adapter, image sizes: thumbnail 400px, card 800px, hero 1600px
- Create `src/payload/globals/Navigation.ts` — nav items array + CTA button label and href
- Create `src/payload/globals/Footer.ts` — footer link groups + social URLs
- Register all collections and globals in `payload.config.ts`

**Claude Code — FRONTEND ENGINEER agent:**
- Configure `tailwind.config.ts` — brand tokens: navy `#0F172A`, indigo `#6366F1`, cyan `#22D3EE`
- Build `src/components/layout/Nav.tsx` — Server Component, fetches Navigation global via Payload Local API, sticky nav with mobile hamburger, header CTA button
- Build `src/components/layout/Footer.tsx` — Server Component, fetches Footer global
- Build `src/app/(frontend)/layout.tsx` — root layout wrapping Nav + Footer

**Success criteria:**
- [x] Payload admin shows Pages, Resources, Media + Navigation, Footer in left sidebar
- [x] `npx tsc --noEmit` passes with zero errors
- [x] Nav and footer render on localhost, responsive at 375px and 1280px

### Day 3 — WordPress → Payload Migration Scripts

**Agents:** MIGRATION ENGINEER · AGILE COACH

> **Payload migration approach:** Migration scripts use the Payload Local API — `payload.create()` writes directly to Neon PostgreSQL in the same Node process. No HTTP calls, no API keys, full TypeScript type safety. Run with: `npx tsx scripts/seed-payload.ts`

**Claude Code — MIGRATION ENGINEER agent:**
- Create `scripts/wp-export.ts` — fetch from live caepe.sh via WordPress REST API:
  - `GET https://caepe.sh/wp-json/wp/v2/pages?per_page=100`
  - `GET https://caepe.sh/wp-json/wp/v2/posts?per_page=100`
  - `GET https://caepe.sh/wp-json/wp/v2/categories?per_page=100` and `/tags`
  - `GET https://caepe.sh/wp-json/wp/v2/media?per_page=100`
  - Save all responses to `/migration/wp-export/` as JSON files
- Create `scripts/wp-to-payload-transform.ts` — transform WP format to Payload `create()` input:

  | WordPress field | Payload field | Transform |
  |---|---|---|
  | `post.title.rendered` | `title` | Strip HTML entities |
  | `post.slug` | `slug` | Use as-is |
  | `post.content.rendered` | `content` (Lexical) | HTML → Lexical JSON via html-to-lexical utility |
  | `post.excerpt.rendered` | `excerpt` | Strip HTML, truncate to 250 chars |
  | `post.date` | `publish_date` | ISO 8601 format |
  | `post.categories` (IDs) | `tags` (array) | Map category IDs to name strings |
  | `yoast_head_json.og_title` | `meta.meta_title` | Direct string mapping |
  | `yoast_head_json.og_description` | `meta.meta_description` | Direct string mapping |
  | `wp:featuredmedia.source_url` | `feature_image` | Download → upload to R2 → store Media relation ID |

- Create `scripts/seed-payload.ts` — call `payload.create()` for each pilot page and article. Log before/after record counts. Mark all documents as `status: 'draft'`.
- Run: `npx tsx scripts/seed-payload.ts` — verify drafts in Payload admin
- Upload all WP media assets referenced in pilot pages to Cloudflare R2 via Payload Media collection
- Record WP baseline Lighthouse scores in `docs/migration/baseline.md` for comparison at Day 11

**Success criteria:**
- [ ] Payload admin shows 4 pages + 1 article as draft documents with correct titles and content
- [ ] Migration log shows matching record counts (WP exported N → Payload created N)
- [ ] All media accessible via public R2 URL with no broken images in Payload admin

### Days 4–5 — /features/ Page (Accordion + Hero)

**Agents:** CMS ENGINEER · FRONTEND ENGINEER · AGILE COACH

> **Payload advantage on this page:** Every feature item is a structured Payload field — name and description are editable by non-developers directly in the admin panel. Add, remove, rename, or reorder feature items with zero developer involvement.

**Claude Code — CMS ENGINEER agent:**
- Create `src/payload/blocks/Hero.ts` — fields: headline, subheadline, cta_label, cta_href, image (Media relation, optional)
- Create `src/payload/blocks/FeatureAccordion.ts` — fields: section_label (e.g. 'Unique CAEPE Features'), section_title (e.g. 'Deployment'), items (array of: feature_name, feature_description). `admin.description`: 'One accordion group — add one block per category'
- Update Pages collection layout field to accept Hero and FeatureAccordion blocks
- In Payload admin: open /features draft, add Hero block + 6 FeatureAccordion blocks (Deployment, Smoke Testing, Edge/Air Gapped, Clusters, etc.). Fill in all feature items from WP export JSON.

**Claude Code — FRONTEND ENGINEER agent:**
- Create `src/components/blocks/HeroBlock.tsx` — headline, subheadline, primary CTA button (links to cta_href), hero image via next/image with `priority={true}` for LCP
- Create `src/components/blocks/FeatureAccordionBlock.tsx` — `'use client'`, Radix UI Collapsible:
  - section_label as eyebrow text (small caps, indigo)
  - section_title as H2 with expand/collapse toggle
  - items as feature cards (name in bold, description as paragraph)
  - Tailwind `data-state:open` transition for smooth animate
- Create `src/components/blocks/BlockRenderer.tsx` — switch on `block.blockType` → correct component
- Create `src/app/(frontend)/features/page.tsx` — Server Component: fetch Pages doc `slug='features'` via `payload.find()`, render BlockRenderer for each block in `page.layout`, `generateMetadata()` from `page.meta`
- Add PDF download CTA: secondary button linking to CAEPE Overview PDF hosted on R2
- Add sticky on-page TOC (desktop only) listing the 6 section names as anchor links

**Success criteria:**
- [ ] All 6 accordion sections visible and expandable on Vercel preview
- [ ] All feature items present — count matches WP source
- [ ] Payload admin: editor adds new feature item to Deployment section, saves, change visible on preview
- [ ] PDF download link opens the CAEPE Overview PDF
- [ ] Responsive at 375px, 768px, 1280px — no horizontal overflow

### Day 6 — /pricing/ Page (Pricing Table Block)

**Agents:** CMS ENGINEER · FRONTEND ENGINEER · AGILE COACH

> **Payload advantage on this page:** The PricingTable block has structured fields for every tier name, price, and feature bullet. A non-developer editor can update pricing directly in Payload admin — no code change.

**Claude Code — CMS ENGINEER agent:**
- Create `src/payload/blocks/PricingTable.ts` — fields: headline, subheadline, tiers (array of: tier_name, price, price_suffix, highlight checkbox, cta_label, cta_href), included_features (array of text), footnote
- In Payload admin: open /pricing draft, add Hero + PricingTable block. Enter all data:
  - Tier 1: Up to 25 clusters — $500.00 — Per cluster* (monthly)
  - Tier 2: 25+ clusters — $250.00 — Per cluster* (monthly)
  - Tier 3: 100+ clusters — $custom — Talk to us (cta_href: `mailto:letschat@caepe.sh`)
  - Included features: Full enterprise support, Unlimited applications/workloads/services, Unlimited nodes, RBAC/SSO integration, DORA metrics, SaaS or Self-hosted option
  - Footnote: *Clusters charged as active after 24 hours | Pricing in USD

**Claude Code — FRONTEND ENGINEER agent:**
- Create `src/components/blocks/PricingTableBlock.tsx`:
  - Desktop: 3-column grid. Mobile: stacked cards.
  - Each card: tier_name in H5, price in large type, price_suffix, feature checklist with green checkmark icons, CTA button
  - included_features as shared "All plans include" section above tiers
  - footnote as small italic text below tiers
- Create `src/app/(frontend)/pricing/page.tsx` — Server Component, fetch Pages `slug='pricing'`, render BlockRenderer, `generateMetadata()`

**Success criteria:**
- [ ] /pricing shows 3-column tiers on desktop, stacked on mobile
- [ ] All feature bullets and footnote match live caepe.sh/pricing/
- [ ] Payload admin: editor changes Tier 1 price, verifies on preview, reverts

### Day 7 — /test-drive/ Lead Capture Page + Form + Mid-Sprint Retro

**Agents:** CMS ENGINEER · FRONTEND ENGINEER · AGILE COACH · RETRO AGENT

**Claude Code — CMS ENGINEER agent:**
- Create `src/payload/blocks/CTAForm.ts` — fields: headline, subheadline, form_id (select: demo-request | contact | newsletter), body_copy (richText, optional)
- In Payload admin: open /test-drive draft, add Hero + CTAForm blocks. Set form_id to `demo-request`.

**Claude Code — FRONTEND ENGINEER agent:**
- Create `src/components/forms/DemoRequestForm.tsx` — `'use client'`, React Hook Form + Zod:
  - Fields: Full Name (required), Work Email (required), Company (required), Role (select: DevOps Engineer, Platform Engineer, Engineering Manager, Other), Clusters (select: <10, 10-25, 25-100, 100+), Message (optional)
  - Cloudflare Turnstile widget before submit button
  - Submit: POST `/api/contact` — shows success thank-you state or inline Zod error messages
- Create `src/components/blocks/CTAFormBlock.tsx` — renders CTAForm block, shows headline + body_copy, renders correct form component based on form_id
- Create `src/app/api/contact/route.ts` — POST handler:
  1. Parse + validate with Zod schema
  2. Verify Cloudflare Turnstile token at `https://challenges.cloudflare.com/turnstile/v0/siteverify`
  3. Send HTML email via Resend to `CONTACT_FORM_TO`
  4. Return `{ success: true }` or error with HTTP status
- Install (if not already from Day 1): `npm install @cloudflare/turnstile`

**Claude Code — RETRO AGENT (end of Day 7):**
- Run mid-sprint retrospective. Output to `docs/retros/retro-day-07.md` using the retro format above.
- Review: Days 1–7 planned vs actual. Which pages are delivered? Which success criteria passed?
- Identify: any tasks that slipped, any blockers that recurred, any risk register items that need re-grading.
- Recommend: adjustments to the Days 8–14 plan. If behind schedule, propose which tasks to compress or defer. If ahead, propose which tasks to pull forward.
- Flag any scope-creep requests that surfaced during Days 1–7 — confirm they are captured as GitHub Issues tagged `post-pilot`.

**Success criteria:**
- [ ] Form submits → email received at `CONTACT_FORM_TO` within 60 seconds with all fields
- [ ] Turnstile blocks POST without valid token (HTTP 400)
- [ ] Zod validation shows inline error on missing required field — no email sent
- [ ] Payload admin: editor updates form headline, change appears on preview
- [ ] Mid-sprint retro completed and saved to `docs/retros/retro-day-07.md`
- [ ] Sprint progress: 3/5 pages delivered (features, pricing, test-drive), on track for Day 14

### Days 8–9 — /resources/ Index + Article Template

**Agents:** CMS ENGINEER · FRONTEND ENGINEER · AGILE COACH

**Claude Code — CMS ENGINEER (Day 8):**
- Verify seeded Resources documents in Payload admin: titles, excerpts, feature images, tags, author, publish dates present
- Add admin UI config to Resources collection: `useAsTitle='title'`, `defaultColumns=['title','status','publish_date','author']`, `admin.description` on all fields

**Claude Code — FRONTEND ENGINEER (Day 8 — /resources/ index):**
- Create `src/app/(frontend)/resources/page.tsx` — Server Component:
  - Accept `searchParams: { tag?: string, page?: string }`
  - Fetch: `payload.find({ collection:'resources', where:{ status:{equals:'published'}, ...(tag?{tags:{contains:tag}}:{}) }, limit:12, page:currentPage, sort:'-publish_date' })`
  - Render ResourceCard grid + TagFilter + Pagination components
- Create `src/components/resources/ResourceCard.tsx` — feature_image (next/image, 16:9), primary tag badge, title, excerpt (120 chars), author + reading time + publish date. Full card is a Next.js Link.
- Create `src/components/resources/TagFilter.tsx` — Server Component: extract all unique tags from Resources collection, render as clickable pills, selected tag in indigo, others in gray. Tag click navigates to `/resources?tag=[value]`.
- Create `src/components/resources/Pagination.tsx` — Previous/Next buttons using Payload pagination meta: `{ hasNextPage, hasPrevPage, page, totalPages }`

**Claude Code — FRONTEND ENGINEER (Day 9 — article template):**
- Create `src/app/(frontend)/resources/[slug]/page.tsx` — Server Component: `payload.find` for slug, render ArticleHeader + ArticleBody + RelatedPosts, `generateMetadata()`, `generateStaticParams()` for all published articles
- Create `src/components/article/ArticleHeader.tsx` — feature_image (full width, priority), H1 title, author, publish date, reading time, tag badges
- Create `src/components/article/ArticleBody.tsx` — render Payload Lexical richText via `@payloadcms/richtext-lexical/react` LexicalRenderer + `@tailwindcss/typography` prose class. Code blocks rendered with Shiki (server-side, zero client JS).
- Create `src/components/article/TableOfContents.tsx` — extract H2/H3 nodes from Lexical JSON (no HTML parsing needed — Lexical is structured), render sticky sidebar desktop TOC + client scroll-spy
- Create `src/components/article/RelatedPosts.tsx` — Server Component: fetch `related_posts` from Resources document (or fallback: 3 most recent articles sharing first tag). Render 3-card grid.
- Create `src/components/article/SocialShare.tsx` — `'use client'`: X/Twitter intent URL, LinkedIn sharing URL, Copy link (Clipboard API with 2-second checkmark confirmation)

**Success criteria:**
- [ ] /resources index: card grid + tag filter + pagination all work
- [ ] Article template renders all components: header, body with prose, sticky TOC, related posts, social share
- [ ] TOC scroll-spy highlights correct section on scroll
- [ ] Payload admin: editor publishes seeded draft article → immediately appears on /resources index

### Day 10 — SEO + Redirects + Sitemap + ISR

**Agents:** PERFORMANCE & SEO · AGILE COACH

**Claude Code — PERFORMANCE & SEO agent:**
- Create `src/lib/metadata.ts` — shared `generateMetadata()` builder: accepts Payload Pages or Resources doc, returns Next.js Metadata with title, description, openGraph, twitter `card:summary_large_image`, canonical URL
- Apply `generateMetadata()` to all 5 pilot pages
- Create `src/app/sitemap.ts` — fetch all published Pages + Resources from Payload, map to `{ url, lastModified, changeFrequency, priority }`
- Create `src/app/robots.ts` — allow all crawlers, disallow `/admin`
- Add 301 redirects to `next.config.ts` (`permanent: true`):
  - `/features/` → `/features`
  - `/pricing/` → `/pricing`
  - `/caepe-test-drive/` → `/test-drive`
  - `/resources/` → `/resources`
  - `/wp-admin/*` → `/` (security redirect)
  - `/wp-login.php` → `/`
- Configure ISR revalidation per page: features=3600s, pricing=86400s, test-drive=3600s, resources=600s, articles=3600s
- Add Payload afterChange hook on Pages + Resources: call `revalidatePath(slug)` on publish
- Add JSON-LD Article structured data to article template

**Success criteria:**
- [ ] All redirect rules return HTTP 301 with correct Location header
- [ ] `/sitemap.xml` accessible with all 5 pilot pages and correct canonical URLs
- [ ] All 5 pages have correct `<title>` and `<meta name=description>` in page source
- [ ] Publish test: change in Payload admin → visible on preview URL within 10 seconds

### Day 11 — Lighthouse Audit + Performance Fixes

**Agents:** PERFORMANCE & SEO · QA ENGINEER · AGILE COACH

**Claude Code — PERFORMANCE & SEO agent:**
- Run Lighthouse CLI on all 5 pages: `npx lighthouse [preview-url]/[page] --output=json`. Save results to `docs/audits/payload-pilot-day11.md`
- Fix Performance issues:
  - Ensure next/image used for ALL images — no raw `<img>` tags
  - Add `sizes` prop to all next/image
  - Add `priority={true}` to LCP image (hero) on each page
  - Fix CLS > 0.1 — add explicit width/height to all images
- Fix Accessibility issues:
  - All images have meaningful alt text
  - Heading hierarchy: H1 → H2 → H3 (no skipped levels)
  - Keyboard focus states visible on all interactive elements
  - Colour contrast ratios meet WCAG AA 4.5:1 minimum
- Compare scores against baseline in `docs/migration/baseline.md`

**Success criteria:**
- [ ] Lighthouse Performance >= 90 on all 5 pages
- [ ] Lighthouse SEO = 100 on all pages
- [ ] Lighthouse Accessibility >= 90 on all pages
- [ ] Performance improvement vs WP baseline documented (expected: +25-35 points)

### Day 12 — Content Editor Test (Payload Admin Validation)

**Agents:** DOCUMENTATION ENGINEER · AGILE COACH

> **Purpose:** Validate that a non-developer content editor can update content in under 5 minutes without developer help. Results directly inform the Day 14 go/no-go decision.

**Claude Code — DOCUMENTATION ENGINEER agent:**
- Create `docs/editor-guide.md` — plain English guide for non-technical editors:
  - How to log in to Payload admin
  - How to edit an existing page: find it, click into a block field, change text, Save Draft, Preview, Publish
  - How to update /features: find FeatureAccordion blocks, add/edit/remove feature items
  - How to update /pricing: find PricingTable block, change tier price or description
  - How to write and publish a new article in Resources collection
  - How to upload a new image to Media
- Create an Editor-role user in Payload admin (Settings → Users → Add User)

**Human — content editor test tasks (no Claude Code):**
1. Log in to Payload admin. Target: < 2 minutes.
2. Open /features page. Add new feature item to Deployment. Save draft, preview, publish. Target: < 5 minutes.
3. Open /pricing page. Change Tier 1 price to $499.00. Preview. Revert to $500.00. Target: < 5 minutes.
4. Create new article in Resources: title, excerpt, 3 paragraphs body, tag, feature image, reading time. Save as draft. Target: < 10 minutes.
5. Attempt to access system-level admin area. Confirm Editor role blocks access.

**Success criteria:**
- [ ] Editor completes tasks 1-3 without developer help
- [ ] Editor creates draft article (task 4) without developer help
- [ ] Editor role correctly blocks system configuration access
- [ ] Editor feedback collected and documented in GitHub Issue

### Day 13 — Polish + Cross-Browser QA

**Agents:** QA ENGINEER · FRONTEND ENGINEER · AGILE COACH

**Claude Code — QA ENGINEER agent:**
- Visual consistency audit — review all 5 pages vs live caepe.sh
- Cross-browser test: Chrome latest, Firefox latest, Safari latest
- Mobile test on physical device — no horizontal scroll, tap targets >= 44px
- Internal link audit: `npx broken-link-checker [preview-url] --recursive` — zero 404 responses
- Redirect verification for all rules
- Fix all QA issues. Log each as GitHub Issue tagged `pilot-bug`.
- Final Lighthouse run — save to `docs/audits/payload-pilot-day13-final.md`

**Success criteria:**
- [ ] No visual inconsistencies across 5 pages
- [ ] No layout breaks in Chrome, Firefox, or Safari
- [ ] No horizontal scroll at 390px viewport (iPhone 14)
- [ ] Zero 404 internal links across all 5 pages
- [ ] All redirect rules return correct HTTP 301

### Day 14 — Stakeholder Review + Go/No-Go Decision + End-of-Sprint Retro

**Agents:** DOCUMENTATION ENGINEER · AGILE COACH · RETRO AGENT

**Claude Code — DOCUMENTATION ENGINEER agent:**
- Prepare `docs/pilot-results.md` — Vercel preview URL for each page, Payload admin URL with demo credentials, Lighthouse scores table vs WP baseline, known limitations list, editor session results, recommended next steps
- Create GitHub Milestone: Pilot — go/no-go. Add all open bug issues.

**Claude Code — RETRO AGENT (before stakeholder review):**
- Run end-of-sprint retrospective. Output to `docs/retros/retro-day-14.md` using the retro format above.
- Full velocity analysis: all 14 days planned vs actual, tasks completed vs carry-over.
- Compile lessons learned across the full sprint — what worked well for Claude Code execution, what required human intervention, what patterns to replicate in the full migration.
- Update the risk register: which risks materialised, which mitigations worked, any new risks for full migration.
- Produce a **full migration readiness assessment**: based on the pilot, estimate effort for the remaining caepe.sh pages (not in pilot scope) and flag any architectural changes needed before scaling.
- Include the retro summary in `docs/pilot-results.md` for the stakeholder review.

**Claude Code — AGILE COACH (final standup):**
- Final standup to `docs/standups/day-14.md` with full sprint summary.
- Confirm all 10 acceptance criteria status (pass/fail/blocked).
- List any open GitHub Issues that need resolution before full migration.

**Stakeholder review agenda (60-90 min):**
1. Live demo: walk through all 5 pages on desktop and mobile
2. Live demo: edit content in Payload admin, show update visible on preview within 10 seconds
3. Walk editor guide — confirm non-developer can own content day-to-day
4. Review Lighthouse scores vs WP baseline
5. Review sprint retro — lessons learned and full migration readiness
6. Review open issues
7. Go/No-Go vote — document in GitHub Issue #1: Pilot Decision

---

## Acceptance Criteria (All 10 Must Pass)

| # | Criterion | How to verify | Pass condition |
|---|---|---|---|
| 1 | All 5 pages render correctly | Open each URL on desktop + mobile | No broken layouts, missing content, or console errors at 375px, 768px, 1280px |
| 2 | Demo form delivers email | Submit form on /test-drive | Email at CONTACT_FORM_TO within 60 seconds, all fields in body |
| 3 | Turnstile blocks bots | POST /api/contact without Turnstile token | HTTP 400 returned — no email sent |
| 4 | Editor updates content without help | Day 12 test tasks | All 3 tasks completed without developer assistance |
| 5 | Lighthouse scores | Run Lighthouse on all 5 pages | Performance >= 90, SEO = 100, Accessibility >= 90 |
| 6 | WordPress redirects work | `curl -sI [url]` | All old WP URLs return HTTP 301 with correct Location |
| 7 | Payload ISR revalidation | Publish change in admin, reload preview | Update visible within 10 seconds |
| 8 | Media uploads to R2 | Upload image in Payload admin | Image accessible via public R2/CDN URL, renders via next/image |
| 9 | No TypeScript errors | `npx tsc --noEmit` | Zero TypeScript compilation errors |
| 10 | Stakeholder sign-off | Day 14 review session | Written approval in GitHub Issue #1 |

**Go decision:** The 10 criteria above are the full verification checklist. For the Day 14 stakeholder go/no-go vote, all 10 must pass. Criteria 1-9 are verified by Claude Code during the pilot; criterion 10 (stakeholder sign-off) is the final human gate.

---

## Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Payload admin rejected by content editor as too complex | LOW | Payload admin is intentionally simple — block-based, not raw JSON. Day 12 is the validation gate. If friction found: add `admin.description` to all fields + 30-min training. Optionally enable Payload Visual Editor plugin. |
| /features/ accordion data entry takes longer than estimated (40+ items) | MEDIUM | Budget 2 extra hours on Day 5. If slow, write a script using `payload.create()` loops from WP export JSON. |
| Cloudflare R2 adapter misconfiguration causes broken images | MEDIUM | Test R2 upload on Day 1 before building any pages. Upload one test image, verify public URL resolves. |
| Resend email delivery goes to spam | LOW | Add DKIM records to caepe.sh domain in Cloudflare DNS before Day 7. Use verified sending domain in Resend dashboard. |
| Neon PostgreSQL free tier exceeded | LOW | 5GB free tier is orders of magnitude larger than needed for a 10-page marketing site. |
| Scope creep during Day 14 stakeholder review | HIGH | All new requests captured as GitHub Issues tagged `post-pilot`. None actioned during pilot sprint. |
| Payload v3 breaking change in a patch update | LOW | Pin exact Payload version in `package.json`. Do not run `npm update` during pilot. |

---

## Known Issues & Learnings

> Accumulated during the pilot. Check this section before installing packages or debugging errors.

### Wrong package names (Day 1)
- **`@payloadcms/storage-cloudflare-r2` does NOT exist.** Use `@payloadcms/storage-s3` instead — Cloudflare R2 is S3-compatible, so the S3 adapter works with the R2 endpoint, access key, and secret.
- **`@cloudflare/turnstile` does NOT exist on npm.** Use `@marsidev/react-turnstile` for the React Turnstile widget.

### Payload config
- The template uses `DATABASE_URL` but our convention is `DATABASE_URI`. Already changed in `payload.config.ts` — do not revert.
- `create-payload-app` CLI fails without a TTY (non-interactive). We scaffold manually from the `with-postgres` template instead.

### Neon connection
- Neon connection strings trigger a `pg` SSL deprecation warning (`SECURITY WARNING: The SSL modes 'prefer', 'require'...`). This is cosmetic — the connection works. Will be resolved in pg v9.
- Neon project ID: `fancy-silence-41824119`, branch: `main` (br-royal-mud-ad0kzzaz).

### npm install
- `npm install` can take 2+ minutes due to the size of the Payload dependency tree (823 packages). Do not kill it prematurely.
- Template included `pnpm` engine requirement — removed since we use `npm`.

---

## References

1. [Payload CMS v3 Documentation](https://payloadcms.com/docs) — Collections, Globals, Blocks, Local API, versions, draft/publish, afterChange hooks, R2 storage adapter
2. [create-payload-app](https://payloadcms.com/docs/getting-started/installation) — Scaffold command (Day 1)
3. [Next.js 15 App Router](https://nextjs.org/docs/app) — Server Components, generateMetadata(), generateStaticParams(), ISR, API Route Handlers
4. [Neon PostgreSQL](https://neon.tech/docs) — Serverless Postgres, branch-per-PR, connection string format
5. [Cloudflare R2](https://developers.cloudflare.com/r2) — Zero-egress object storage
6. [@payloadcms/storage-s3](https://www.npmjs.com/package/@payloadcms/storage-s3) — Payload S3/R2 storage adapter (R2 is S3-compatible)
7. [Resend API](https://resend.com/docs) — Transactional email
8. [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile) — Bot protection
9. [Radix UI Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) — Accessible accordion
10. [@payloadcms/richtext-lexical](https://payloadcms.com/docs/rich-text/lexical) — Lexical rich text renderer
11. [Shiki](https://shiki.style) — Server-side syntax highlighting
12. [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) — Prose styles for article body
