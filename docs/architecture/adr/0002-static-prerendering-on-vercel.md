# ADR 0002: Static prerendering on Vercel

- **Status:** Accepted
- **Date:** 2026-11-04

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
- There are no dynamic APIs, route handlers, Server Actions or `proxy.ts`.

**Deploy:**
- Deploy to **Vercel** with a normal `next build`, **not** `output: 'export'`.
- That keeps:
  - `next.config.ts` `headers()` for CSP and security headers;
  - the built-in image optimisation for `next/image`;
  - file-based metadata routes (robots, sitemap, manifest, OG image).

## Alternatives considered

| Option | Why not |
|---|---|
| `output: 'export'` (pure static files) | Loses `headers()` (headers would move into hosting config) and image optimisation (a custom loader or unoptimised images would be needed). More moving parts for no benefit on Vercel. |
| Dynamic rendering | Needed only for nonce CSP ([ADR 0008](0008-csp-for-static-pages.md)); slower TTFB, no CDN caching, higher cost |
| Other hosts (Netlify, Cloudflare, Hostinger static) | Possible, but the roadmap names Vercel and it supports Next.js features natively |

## Consequences

- Zero server compute at runtime; pages are served from the CDN.
- Any feature that would force dynamic rendering (cookies, headers, nonce) needs a new ADR.
- Vercel's Hobby plan suits a personal, non-commercial site; image-optimisation usage is small (about 20 source images).
