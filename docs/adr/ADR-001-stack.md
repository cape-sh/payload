# ADR-001: Technology Stack Selection

**Status:** Accepted
**Date:** 2026-03-11
**Context:** Selecting the stack for the caepe.sh marketing site migration from WordPress.

## Decision

| Layer | Choice | Rationale |
|---|---|---|
| CMS | Payload CMS v3 (3.77.0) | Embeds inside Next.js — one codebase, one deployment. Full TypeScript types, Local API with zero network latency, block-based editing for non-developers. |
| Framework | Next.js 15 (App Router) | Server Components for performance, ISR for caching, `generateMetadata()` for SEO, native with Payload v3. |
| Database | Neon PostgreSQL (serverless) | Zero cold-start pooling, branch-per-PR for previews, generous free tier, Payload's first-class postgres adapter. |
| Hosting | Vercel Pro | Native Next.js hosting, preview deployments per PR, edge network, integrates with Neon branching. |
| Media storage | Cloudflare R2 | Zero-egress object storage, S3-compatible API, Payload has an official `@payloadcms/storage-cloudflare-r2` adapter. |
| Email | Resend | Simple transactional email API, good deliverability, easy DKIM setup. |
| Bot protection | Cloudflare Turnstile | Privacy-friendly CAPTCHA alternative, free tier sufficient. |
| UI | Tailwind CSS + Radix UI | Utility-first CSS for speed, Radix for accessible primitives (accordion). |

## Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Sanity / Contentful | External hosted CMS — adds network latency, vendor lock-in on content, separate billing. |
| WordPress (stay) | Poor Lighthouse scores, PHP/MySQL stack mismatch with team skills, no TypeScript, plugin security surface. |
| Astro | No embedded CMS story like Payload; would still need a headless CMS. |
| PlanetScale | MySQL-only; Payload's postgres adapter is more mature. |
| AWS S3 | Egress costs for media delivery; R2 is zero-egress. |

## Consequences

- Single repo, single deployment — simpler ops than WordPress (no PHP, no MySQL, no plugins).
- Payload admin at `/admin` — editors update content without developer involvement.
- TypeScript end-to-end — collection schemas generate types used in frontend components.
- Neon branching enables database-per-preview-deployment.
- R2 zero-egress means media costs are predictable regardless of traffic.
