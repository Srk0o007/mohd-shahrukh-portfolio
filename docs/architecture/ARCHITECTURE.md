# Architecture

**Phase:** 05 — Technical Architecture
**Date:** 2026-11-04
**Status:** Approved approach; documents in review (PR)

Related: [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) · [COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) · [DATA_MODEL.md](DATA_MODEL.md) · [ENGINEERING_GUIDELINES.md](ENGINEERING_GUIDELINES.md) · [ADRs](adr/) · Requirements: [docs/requirements/](../requirements/) · Design: [docs/design/](../design/)

---

## 1. Context

- **The product:** a single-page personal portfolio plus a 404 page.
- **Content:** static and edited by the owner in the repository (PRD AS5).
- **Interactivity:** limited to navigation, theme, project filtering, a few disclosures and a contact form (FR-*).
- **Quality targets:** WCAG 2.2 AA, Lighthouse ≥ 95, first-load JS ≤ 150 KB gzip, and no unnecessary dependencies (NFR-*).

## 2. Architecture at a glance

```
            Build time (CI / Vercel)                         Runtime (browser)
┌──────────────────────────────────────────┐      ┌──────────────────────────────────────┐
│ src/content/*.ts  ──typed──▶  Server      │      │ Static HTML + CSS (all content)       │
│ (single content source)       Components  │──▶   │   + small Client Component islands:   │
│ src/assets/images ─static──▶  next/image  │ CDN  │   theme, menu, active section, filter,│
│ next/font (self-hosted)       metadata    │      │   highlights, skills strip, form,     │
│ app/robots|sitemap|manifest|og-image      │      │   back-to-top                         │
└──────────────────────────────────────────┘      └───────────────┬──────────────────────┘
                                                                   │ fetch (on submit only)
                                                                   ▼
                                                     Formspree (third-party form endpoint)
```

| Layer | Choice | ADR |
|---|---|---|
| Framework | Next.js **16.4** App Router, React **19.3** | [0002](adr/0002-static-prerendering-on-vercel.md) |
| Language | TypeScript **6.0.3**, strict | [0011](adr/0011-pin-typescript-6.md) |
| Rendering | Static prerendering at build time; no application-owned server code at runtime (see §2.1) | [0002](adr/0002-static-prerendering-on-vercel.md) |
| Hosting | Vercel; plan (Hobby intended) verified in Phase 12 | [0002](adr/0002-static-prerendering-on-vercel.md) |
| Content | Typed TypeScript modules in `src/content/` | [0003](adr/0003-typed-content-modules.md) |
| Styling | Tailwind CSS **4.3**, design tokens as CSS variables | [0004](adr/0004-tailwind-v4-design-tokens.md) |
| Theme | Custom inline pre-paint script plus a small client toggle | [0005](adr/0005-custom-theme-script.md) |
| Contact form | Formspree; progressive enhancement; no custom backend | [0006](adr/0006-formspree-contact-form.md) |
| Testing | Vitest + Testing Library; Playwright + axe-core | [0007](adr/0007-testing-stack.md) |
| Security headers | Static CSP that allows inline scripts; everything else strict | [0008](adr/0008-csp-for-static-pages.md) |
| Icons | Inline SVG components copied from permissive sets | [0009](adr/0009-inline-svg-icons.md) |
| Images | `next/image` with static imports, AVIF/WebP | [0010](adr/0010-image-handling.md) |
| Decision records | Lightweight ADRs | [0001](adr/0001-record-architecture-decisions.md) |

### 2.1 What runs at runtime

| Category | Present? | Detail |
|---|---|---|
| Application-owned dynamic rendering | **No** | All pages and metadata routes are prerendered at build ([ADR 0002](adr/0002-static-prerendering-on-vercel.md)) |
| Custom server endpoints (route handlers, Server Actions, `proxy.ts`) | **No** | None exist; adding one requires an ADR |
| Platform-managed image optimisation | **Yes, potentially** | Vercel transforms each source image on first request per size and format, then caches it ([ADR 0010](adr/0010-image-handling.md)). This is runtime processing subject to plan limits and cost, verified in Phase 12. |
| Third-party processing | Yes | Formspree receives form submissions directly from the browser |
| Browser JavaScript | Yes | 8 small client islands plus the theme script |

The deployment therefore has **no application-owned server compute**. It is **not** free of runtime processing while image optimisation is enabled.

## 3. External services: are they required?

| Need | Service | Required? | Reason |
|---|---|---|---|
| Hosting + CDN | Vercel | **Yes** | Roadmap Phase 12; serves prerendered files, applies headers, and performs managed image optimisation (runtime, cached). Plan limits, image-optimisation pricing and acceptable-use terms are verified in Phase 12 ([ADR 0002](adr/0002-static-prerendering-on-vercel.md)). |
| Contact form delivery | Formspree | **Yes** | A static site cannot send email; FR-CON-02 is a Must. Formspree is the existing provider: no server, no secrets ([ADR 0006](adr/0006-formspree-contact-form.md)) |
| Domain / DNS | Hostinger | **Yes** | Existing registrar (Phase 12) |
| Analytics | — | **No** | D21 |
| CMS / database | — | **No** | Content changes rarely; it lives in the repository (ADR 0003) |
| Email API (Resend etc.), serverless functions | — | **No** | Would add a backend, secrets and DNS records with no user benefit over Formspree |
| Font / icon CDNs | — | **No** | Fonts are self-hosted at build (`next/font`); icons are inline SVG |

## 4. Routing strategy

| Route | Source | Rendering | Notes |
|---|---|---|---|
| `/` | `app/page.tsx` | Static (○) | The whole portfolio; sections addressed by anchors (`#about` … `#contact`) |
| Not found | `app/not-found.tsx` | Static | HTTP 404 with `noindex` (FR-ERR-01, NFR-SEO-09) |
| `/robots.txt` | `app/robots.ts` | Static | NFR-SEO-03 |
| `/sitemap.xml` | `app/sitemap.ts` | Static | NFR-SEO-03 |
| `/manifest.webmanifest` | `app/manifest.ts` | Static | NFR-SEO-07 |
| `/opengraph-image` | `app/opengraph-image.tsx` | Static (built once) | 1200×630 (NFR-SEO-04) |
| `/icon.svg`, `/apple-icon.png` | `app/icon.svg`, `app/apple-icon.png` | Static files | NFR-SEO-07 |
| CV | `public/Mohd_Shahrukh_Resume_03_Nov_2026.pdf` | Static file | FR-RES-06 (filename finalised in Phase 06) |

There are no other pages, no dynamic segments, no route handlers, no Server Actions and no `proxy.ts`. **Legacy anchors** (`#home`, `#resume`, `#portfolio`, `#testimonial`; FR-NAV-06, Could) are handled by a few lines in an existing client island, not by routes.

## 5. Rendering model: Server vs Client Components

**Rule:** everything is a Server Component unless it needs state, effects, event handlers or browser APIs. Client islands receive **serialisable props only** and are kept as small and as low in the tree as possible.

| Component | Type | Why |
|---|---|---|
| `app/layout.tsx`, `app/page.tsx`, all section shells, cards, lists, footer | Server | Pure rendering of content |
| `ThemeScript` (inline `<script>`) | Server-rendered inline script | Must run before paint, so it can't be a React effect |
| `ThemeToggle` | **Client** | Click handler, `localStorage`, `matchMedia` listener |
| `MobileMenu` | **Client** | Open state, focus containment, Esc key, scroll lock |
| `ActiveSectionObserver` (+ legacy-anchor mapping) | **Client** | IntersectionObserver → `aria-current` on nav links |
| `ProjectGallery` (filter + grid) | **Client** | Filter state; per-visible-index layout classes; live status |
| `ProjectCard` | Shared (no hooks) | Rendered by the client gallery; can also render on the server |
| `HighlightsDisclosure` | **Client** | `aria-expanded` toggle; collapses only after hydration |
| `SkillsStripControl` | **Client** | Pause/play state; IntersectionObserver start |
| `ContactForm` | **Client** | Validation, async submit, status |
| `BackToTop` | **Client** | Visibility via IntersectionObserver |

**Progressive enhancement:**
- The inline theme script sets `data-js` on `<html>`. CSS uses `html:not([data-js])` to show the no-JS fallbacks:
  - the nav links render as a visible wrapped list, and the menu button is hidden;
  - the filter chips are hidden;
  - every experience highlight is visible.

  This satisfies NFR-BRW-03, FR-PRJ-02 and FR-RES-02.
- The form keeps `action`/`method` attributes, so it posts without JS (FR-CON-06).

## 6. Layout architecture

```
<html lang="en" data-theme data-js suppressHydrationWarning>   ← app/layout.tsx
  <head> ThemeScript · metadata (generated) · font CSS vars
  <body>
    SkipLink
    SiteHeader ─ Wordmark · Nav (server) · ThemeToggle* · CV link · MobileMenu*
    <main id="main">                                         ← app/page.tsx
      Hero · SkillsStrip(*) · About · Services · Experience(*) · Skills
      Certifications · Education · Projects(*) · HireCta · Testimonials · Contact(*)
    </main>
    SiteFooter · BackToTop* · ActiveSectionObserver*
```

`*` marks a client island; `(*)` marks a server section containing a client island. The header and footer live in the root layout, so `not-found.tsx` inherits them (FR-ERR-01).

## 7. Content data architecture

**Data flow:**

```
src/content/types.ts        types (DATA_MODEL.md)
src/content/<area>.ts       typed data (`as const satisfies Type`)
src/content/index.ts        single export surface
      │
      ├── Server Components import directly (no fetching, no props drilling across the tree)
      └── Client islands receive plain serialisable slices as props
```

- Images are referenced by **static imports** inside the content modules. Each import yields `StaticImageData` with intrinsic width and height (no CLS; DS-08 ratio decision).
- **Invariants:**
  - Compile-time: the type system, for example the discriminated union for project links.
  - Build-time: Vitest content tests (`src/content/content.test.ts`) run in CI before the build ([DATA_MODEL.md §5](DATA_MODEL.md#5-invariants-and-validation)).

## 8. Styling and theming

- **Tailwind v4, CSS-first** (`@import "tailwindcss"` in `app/globals.css`):
  - The Phase 04 tokens are declared as CSS variables per theme.
  - They are exposed to Tailwind through `@theme inline`.
  - The default palette is cleared (`--color-*: initial`), so only design tokens can be used.
- **Dark variant:** `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`.
- **Fluid type and spacing tokens** come from [TYPOGRAPHY.md](../design/TYPOGRAPHY.md) and [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md).
- **Reduced motion:** global `@media (prefers-reduced-motion: reduce)` rules, plus the `motion-safe:` and `motion-reduce:` variants.

## 9. Image handling

`next/image` with static imports, `formats: ['image/avif', 'image/webp']` and `qualities: [75]` (the Next 16 default).

| Image | Attributes |
|---|---|
| Portrait (LCP candidate) | `fetchPriority="high"`, `loading="eager"` |
| All other images | `loading="lazy"` (default) |
| Every image | `sizes` per layout span ([COMPONENT_ARCHITECTURE.md §6](COMPONENT_ARCHITECTURE.md#6-image-sizes)) |

Source files are renamed (no spaces or parentheses) and kept as the highest-quality originals. Vercel's image optimiser generates the AVIF/WebP variants **on demand at runtime** and caches them (§2.1). Details: [ADR 0010](adr/0010-image-handling.md).

## 10. Font loading

`next/font/google` downloads the fonts at build time and self-hosts them, with no runtime Google request:

- **Fraunces:** `axes: ['opsz']`, variable weight, `subsets: ['latin']`, `display: 'swap'`, CSS variable `--font-display`.
- **Inter:** variable, Latin, swap, `--font-sans`.
- `adjustFontFallback` (default) limits CLS.

That's 2 files (NFR-PERF-07, DS-04).

## 11. Metadata strategy

| Item | Implementation | Requirement |
|---|---|---|
| Title, description, canonical, Open Graph, Twitter | `export const metadata: Metadata` in `app/layout.tsx`, built from `siteMeta`; `metadataBase = new URL('https://mohdshahrukh.in')` | NFR-SEO-01/02/04 |
| OG image | `app/opengraph-image.tsx` (`ImageResponse`, generated once at build) using a committed Fraunces TTF (OFL) | NFR-SEO-04 |
| robots / sitemap / manifest | `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` | NFR-SEO-03/07 |
| Icons | `app/icon.svg`, `app/apple-icon.png`; manifest icons 192/512 | NFR-SEO-07 |
| Structured data | JSON-LD `Person` (verified fields only) rendered as `<script type="application/ld+json">` in `page.tsx`; a non-executing data block | NFR-SEO-05 |
| 404 | `not-found.tsx` exports `robots: { index: false }` | NFR-SEO-09 |
| Theme colour | `export const viewport` with `themeColor` for light and dark | — |

## 12. Error handling

| Scope | Mechanism | Behaviour |
|---|---|---|
| Unknown URL | `app/not-found.tsx` | Branded 404 (FR-ERR-01) |
| Render error in a page segment | `app/error.tsx` (client) | Accessible message and "Try again" (`reset()`); no stack traces shown |
| Error in the root layout | `app/global-error.tsx` | Minimal standalone page with its own `<html>`/`<body>` |
| Build-time content errors | Type errors and Vitest content tests | The build fails; nothing broken ships |
| Contact form | `ContactForm` state machine | Validation errors inline; network or provider failure → `role="alert"` with the email fallback (FR-CON-04) |
| Theme storage unavailable | try/catch in the script and toggle | Falls back to the session-only theme (FR-THM-02) |
| Client island failure | Islands are optional enhancements | Static content stays usable |

## 13. Contact form architecture

```
ContactForm (client)
  ├─ <form action={FORM_ENDPOINT} method="post" noValidate>   ← works without JS (FR-CON-06)
  ├─ fields: name, email, message (+ honeypot `_gotcha`, hidden)
  ├─ onSubmit: preventDefault → validateContact() (lib, pure, unit-tested)
  │     invalid → aria-invalid + messages + focus first invalid (FR-CON-03)
  │     valid   → status "sending" → fetch(FORM_ENDPOINT, { method: 'POST',
  │                 headers: { Accept: 'application/json' }, body: FormData })
  │                 ok  → status "success" (role=status), reset form
  │                 err → status "error" (role=alert), keep input, email fallback
  └─ status machine: idle → sending → success | error
```

- **Endpoint:** a non-secret public form ID in `src/config/site.ts`.
- **Spam:** the Formspree honeypot (`_gotcha`) plus provider spam filtering (FR-CON-05).
- **CSP:** `connect-src` and `form-action` allow `https://formspree.io` ([ADR 0008](adr/0008-csp-for-static-pages.md)).
- **Open item:** the owner confirms access to the existing Formspree form (`xleyzgzo`) in Phase 09. Otherwise a new free form is created and its ID swapped in config.

## 14. Security

| Control | Where |
|---|---|
| CSP and security headers | `next.config.ts` → `headers()` ([ADR 0008](adr/0008-csp-for-static-pages.md)) |
| No secrets | Only public config; `.env*` ignored (NFR-SEC-05) |
| External links | `ExternalLink` component always sets `rel="noopener noreferrer"` (NFR-SEC-04) |
| User input | Never rendered back into the page; sent only to Formspree (NFR-SEC-07) |
| Dependencies | 3 runtime dependencies; `npm audit` in CI (NFR-SEC-06) |
| `poweredByHeader` | Disabled |

## 15. Testing architecture

| Level | Tool | Scope | Runs |
|---|---|---|---|
| Static | `tsc --noEmit`, ESLint (Next core-web-vitals + TypeScript + jsx-a11y), Prettier check | All code | Every PR (CI) |
| Unit | Vitest | `lib/*` (validation, date formatting, project layout, theme helpers), content invariants | Every PR |
| Component | Vitest + Testing Library (jsdom) + user-event + jest-dom | MobileMenu, ThemeToggle, ProjectGallery, HighlightsDisclosure, ContactForm | Every PR |
| End-to-end | Playwright (Chromium, Firefox, WebKit) against `next start` | AC-NAV, AC-PRJ, AC-CON (provider mocked via route interception), AC-THM, AC-INT, no-JS | Every PR (Chromium); full browser matrix before release |
| Accessibility | `@axe-core/playwright` | Home and 404 pages, both themes, 375 and 1280 px | Every PR |
| Performance / SEO | Lighthouse CI (`@lhci/cli`) | Budgets per NFR-PERF/SEO | Added in Phase 11 |

Details: [ADR 0007](adr/0007-testing-stack.md) and [ENGINEERING_GUIDELINES.md §6](ENGINEERING_GUIDELINES.md#6-testing).

## 16. Build and CI

| Step | Command |
|---|---|
| Install | `npm ci` |
| Format | `npm run format:check` (Prettier) |
| Lint | `npm run lint` (`eslint .`; `next lint` was removed in Next 16) |
| Type check | `npm run typecheck` (`tsc --noEmit`) |
| Unit and component tests | `npm test` (`vitest run`) |
| Build | `npm run build` (Turbopack, the Next 16 default); the build output must mark `/` as static (○) |
| E2E and accessibility | `npm run test:e2e` (Playwright) |

The workflow lives in `.github/workflows/ci.yml` (added in Phase 06 per NFR-MNT-07).

## 17. Dependency budget

| Kind | Packages |
|---|---|
| **Runtime (3)** | `next`, `react`, `react-dom` |
| Dev: language and build | `typescript@6.0.3`, `@types/react`, `@types/react-dom`, `@types/node`, `tailwindcss`, `@tailwindcss/postcss` |
| Dev: quality | `eslint`, `eslint-config-next`, `eslint-plugin-jsx-a11y` (rules enabled explicitly), `eslint-config-prettier`, `prettier`, `prettier-plugin-tailwindcss` |
| Dev: testing | `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@playwright/test`, `@axe-core/playwright` |
| Later (Phase 11) | `@lhci/cli` |

Any addition needs a justification in the PR and an ADR if it is a runtime dependency (NFR-MNT-05).

## 18. Requirement coverage highlights

| Requirement | Architectural answer |
|---|---|
| NFR-PERF-05 (JS ≤ 150 KB) | Server Components by default; 8 small islands; no runtime libraries beyond React and Next |
| NFR-PERF-09 (pre-rendered) | Static `/` ([ADR 0002](adr/0002-static-prerendering-on-vercel.md)) |
| NFR-MNT-03 (content separation) | `src/content/` single source ([ADR 0003](adr/0003-typed-content-modules.md)) |
| NFR-SEC-02 (CSP) | Amended by owner decision ([ADR 0008](adr/0008-csp-for-static-pages.md)) |
| NFR-BRW-03 (no-JS) | `data-js` flag pattern; form `action` fallback |
| FR-THM-02 (no flash) | Pre-paint inline script ([ADR 0005](adr/0005-custom-theme-script.md)) |
