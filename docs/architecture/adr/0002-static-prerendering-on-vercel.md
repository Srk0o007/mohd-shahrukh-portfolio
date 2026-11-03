# ADR 0002: Static prerendering on Vercel

- **Status:** Accepted
- **Date:** 2026-11-04
- **Revision:** 2026-11-04, before merge, per owner review. Runtime-compute boundaries clarified; the hosting plan is deferred to Phase 12.

## Context

The site is one page of static content plus a 404 page.

**Requirements:**
- Pre-rendered HTML (NFR-PERF-09)
- Strong Core Web Vitals (NFR-PERF-01–04)
- Security headers (NFR-SEC-01–03)
- Optimised images (NFR-PERF-06)
- No unnecessary backend (Phase 05 brief)

The roadmap targets Vercel (Phase 12).

## Decision

**Build:**
- Use Next.js 16 App Router with **default static prerendering**.
- Every route is generated at build time (`/` must show as ○ Static).

**Deploy:**
- Deploy to **Vercel** with a normal `next build`, **not** `output: 'export'`.
- That keeps:
  - `next.config.ts` `headers()` for CSP and security headers;
  - Vercel-managed image optimisation for `next/image` ([ADR 0010](0010-image-handling.md));
  - file-based metadata routes (robots, sitemap, manifest, OG image), all generated at build time.

### Runtime compute boundaries

"Static" here means **the application owns no runtime server logic**. It does **not** mean the deployment performs zero runtime processing.

| Concern | At runtime? | Owner | Notes |
|---|---|---|---|
| Page HTML (`/`, 404) | **No**: prerendered at build, served from the CDN | — | No application-owned dynamic rendering; no `connection()`, `cookies()`, `headers()` reads or `dynamic = 'force-dynamic'` |
| Route handlers (`app/**/route.ts`), Server Actions, `proxy.ts` | **None exist** | — | Adding any requires a new ADR |
| Metadata routes (robots, sitemap, manifest, OG image) | **No**: generated at build | — | Must stay static (verified in build output) |
| Security headers | Applied by the platform from build configuration | Vercel | No custom code executes per request |
| **Image optimisation** (`/_next/image`) | **Yes, potentially.** Vercel resizes and transcodes a source image on first request for each size and format, then caches the result. | **Vercel-managed** | Not application code, but it is runtime processing with usage limits and possible cost (see Consequences) |
| Contact form delivery | Yes, on Formspree (third party) | Formspree | Browser → Formspree; nothing passes through our deployment ([ADR 0006](0006-formspree-contact-form.md)) |

## Alternatives considered

| Option | Why not |
|---|---|
| `output: 'export'` (pure static files) | Removes all platform runtime processing, including images. But it loses `headers()` (headers would move into hosting config) and needs unoptimised images or a custom loader/pre-build pipeline. Kept as the **fallback** if Phase 12 finds image-optimisation limits or costs unacceptable. |
| Dynamic rendering | Needed only for nonce CSP ([ADR 0008](0008-csp-for-static-pages.md)); slower TTFB, no CDN caching, higher cost |
| Other hosts (Netlify, Cloudflare, Hostinger static) | Possible, but the roadmap names Vercel and it supports these Next.js features natively |

## Consequences

- **No application-owned server code runs at runtime.** Pages, metadata and headers are build artefacts served from the CDN.
- **One category of platform runtime processing remains:** Vercel image optimisation (on-demand transformation, then cached). Its volume depends on the number of source images (about 20), widths and formats (AVIF + WebP), and cache lifetime.
- Any feature that would force dynamic rendering (cookies, request headers, nonce) or add server endpoints needs a new ADR.
- **The hosting plan is a deployment-stage decision (Phase 12).** Vercel Hobby is the intended starting point for a personal, non-commercial site. Before go-live, Phase 12 must verify, against Vercel's current published terms:
  1. Hobby usage limits (bandwidth, requests, build minutes);
  2. image-optimisation limits and pricing (transformations, cache reads/writes, source-image counts);
  3. acceptable-use / fair-use terms for a personal portfolio.

  If any is unacceptable, the options are a paid plan, `images.unoptimized` with pre-optimised assets, or the `output: 'export'` fallback. The chosen option is recorded as a superseding ADR.
