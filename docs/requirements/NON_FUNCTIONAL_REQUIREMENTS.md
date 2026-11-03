# Non-Functional Requirements

**Phase:** 03 — Requirements & Content Specification
**Date:** 2026-11-03

## Conventions

- **ID format:** `NFR-<AREA>-<NN>`
- **Priority:** MoSCoW, as in [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md#conventions)
- **Source:** links each requirement to an audit finding ([WEBSITE_AUDIT.md](../audit/WEBSITE_AUDIT.md)), a global project instruction (`GI`), or an owner decision (D#)
- **Verification:** each requirement's acceptance criteria name the tool or method used to check it. Tools are introduced in Phases 06, 10 and 11.

| Area | Prefix | Count |
|---|---|---|
| Accessibility | A11Y | 12 |
| Performance | PERF | 9 |
| SEO | SEO | 9 |
| Security and privacy | SEC | 9 |
| Maintainability | MNT | 9 |
| Responsive behaviour | RSP | 6 |
| Browser compatibility | BRW | 4 |

---

## 1. Accessibility (A11Y)

**Target:** WCAG 2.2 Level AA (GI).

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| NFR-A11Y-01 | The site conforms to WCAG 2.2 AA in both themes. | Must | • Phase 10 audit records no open AA failures<br>• Audit covers every section, the 404 page, and both themes | All FR | GI |
| NFR-A11Y-02 | Automated checks report no violations. | Must | • axe-core reports **0 violations** on the home page and the 404 page, in both themes, at 375 and 1280 px<br>• Lighthouse Accessibility = 100 (Should) / ≥ 95 (Must) | Phase 11 tooling | GI |
| NFR-A11Y-03 | Semantic structure and landmarks. | Must | • `header`, `nav` (labelled), `main`, `footer` landmarks<br>• Exactly one `<h1>`; heading levels never skip<br>• Every section has an `<h2>` and an `id` anchor<br>• `<html lang="en">` | — | A8, A13 |
| NFR-A11Y-04 | Colour contrast. | Must | • Text ≥ 4.5:1 (large text ≥ 3:1) (1.4.3)<br>• UI component boundaries, icons and focus indicators ≥ 3:1 (1.4.11)<br>• Checked for both themes against the Phase 04 token pairs<br>• Information is never conveyed by colour alone (1.4.1) | Phase 04 tokens | A3 |
| NFR-A11Y-05 | Keyboard access and focus visibility. | Must | • All functionality is keyboard-operable (2.1.1) with no traps (2.1.2)<br>• Focus order is logical (2.4.3)<br>• The focus indicator is always visible (2.4.7): at least a 2 px outline with ≥ 3:1 contrast<br>• Focused elements are never hidden by the sticky header (2.4.11) | — | A4–A6 |
| NFR-A11Y-06 | Target size. | Must | • Interactive targets ≥ 24×24 CSS px, or adequately spaced (2.5.8)<br>• **Should:** primary nav, CTAs and the menu toggle ≥ 44×44 on touch | Phase 04 | WCAG 2.2 |
| NFR-A11Y-07 | Text alternatives. | Must | • Informative images have meaningful alt text (from content)<br>• Decorative images and icons use `alt=""` / `aria-hidden="true"`<br>• Icon-only controls have accessible names | CONTENT_SCHEMA | A5, A6, A12 |
| NFR-A11Y-08 | Motion and animation. | Must | • Meets 2.2.2 (pause, stop, hide)<br>• Honours `prefers-reduced-motion` (FR-INT-02)<br>• Nothing flashes more than 3 times per second (2.3.1) | FR-INT-02/03 | A1, A2, A10 |
| NFR-A11Y-09 | Forms are accessible. | Must | • Labels and instructions (3.3.2), error identification (3.3.1) and suggestions (3.3.3)<br>• Status messages announced (4.1.3)<br>• Input purpose identified with `autocomplete` (1.3.5) | FR-CON-02…04 | A14 |
| NFR-A11Y-10 | Reflow, zoom and text spacing. | Must | • No 2-D scrolling at a 320 CSS px width or 400% zoom (1.4.10)<br>• Text resizable to 200% without loss (1.4.4)<br>• Content survives the text-spacing overrides in 1.4.12 | NFR-RSP-01 | Audit §7 (375 px overflow) |
| NFR-A11Y-11 | Screen-reader testing. | Should | • Smoke test passes with NVDA + Chrome (Windows) and VoiceOver + Safari (iOS): navigation menu, project filter, contact form, theme toggle and CV link are understandable and operable | Phase 10 | GI |
| NFR-A11Y-12 | Links are descriptive and new-tab behaviour is announced. | Must | • Link purpose is clear from the link text or its context (2.4.4)<br>• Links that open a new tab say so to all users | FR-PRJ-03, FR-SOC-01 | A5, A6 |

## 2. Performance (PERF)

**Measured on:** the production build of the home page, using Lighthouse mobile (simulated throttling), unless stated otherwise.

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| NFR-PERF-01 | Largest Contentful Paint. | Must | • LCP ≤ 2.5 s (lab, mobile)<br>• After launch, field p75 ≤ 2.5 s when data is available | FR-HERO-02 | P2, P8 |
| NFR-PERF-02 | Layout stability. | Must | • CLS ≤ 0.1<br>• All images and media have explicit dimensions<br>• Fonts do not cause visible layout shift | NFR-PERF-07 | P1 |
| NFR-PERF-03 | Responsiveness. | Must | • INP ≤ 200 ms (field) and Total Blocking Time ≤ 200 ms (lab)<br>• The theme script that runs before paint is ≤ 1 KB | — | P5 |
| NFR-PERF-04 | Lighthouse scores. | Must | • Mobile scores ≥ 95 for Performance, Accessibility, Best Practices and SEO | All | GI |
| NFR-PERF-05 | JavaScript budget. | Must | • First-load JS ≤ 150 KB gzipped (**Should:** ≤ 120 KB)<br>• No jQuery or animation libraries (NFR-MNT-05)<br>• Interactive parts are client components; everything else renders on the server | Phase 05 | P5 |
| NFR-PERF-06 | Image delivery. | Must | • AVIF or WebP with responsive `srcset`/`sizes`<br>• Below-the-fold images lazy-loaded; the LCP image prioritised<br>• Initial-view transfer (all resources before scrolling) ≤ 500 KB on mobile<br>• Total transfer after a full scroll ≤ 1.5 MB (the current site is about 10.7 MB) | Phase 06 asset pipeline | P1–P4 |
| NFR-PERF-07 | Web fonts. | Must | • Self-hosted, with no runtime request to Google Fonts<br>• At most 2 families, with only the weights used (≤ 4 font files)<br>• Subset to Latin; `font-display: swap` (or `optional`) with a matched fallback | Phase 04 typography | P6 |
| NFR-PERF-08 | No blocking third parties. | Must | • No third-party scripts at load<br>• The only third-party network request is the form submission, made only on submit<br>• No preloader | FR-INT-04 | P5, P8, D21 |
| NFR-PERF-09 | Pre-rendered HTML. | Should | • The home page is served as pre-rendered, statically generated HTML<br>• TTFB ≤ 800 ms on the production host | Phase 05, 12 | Best practice |

## 3. SEO (SEO)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| NFR-SEO-01 | Title and meta description. | Must | • `<title>`: "Mohd Shahrukh \| Software Development Engineer – Frontend" (live-site title, verified)<br>• Meta description ≤ 160 chars, built only from verified facts ([CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) `SiteMeta`) | CONTENT_SCHEMA | Audit §4 (outdated description) |
| NFR-SEO-02 | A single canonical host. | Must | • `<link rel="canonical" href="https://mohdshahrukh.in/">`<br>• `www` and `http` variants 301 to `https://mohdshahrukh.in/` | Phase 12 (DNS) | Audit §4 (www duplicate) |
| NFR-SEO-03 | Crawl directives. | Must | • `/robots.txt` allows crawling and references the sitemap<br>• `/sitemap.xml` lists the canonical URL | — | Audit §4 |
| NFR-SEO-04 | Social sharing cards. | Must | • Open Graph (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`) and `twitter:card=summary_large_image`<br>• `og:image` is an **absolute** URL to a 1200×630 image made only from existing assets<br>• Validated with a social preview debugger | Phase 06 asset | Audit §4 (relative og:image) |
| NFR-SEO-05 | Structured data. | Should | • JSON-LD `Person` with only verified fields: `name`, `jobTitle`, `url`, `sameAs` (LinkedIn, GitHub), `address.addressLocality` "Bangalore"<br>• Passes the Schema.org validator with no errors | CONTENT_SCHEMA | Best practice |
| NFR-SEO-06 | Crawlable content. | Must | • All text content is present in the server-rendered HTML (not injected client-side)<br>• Headings follow NFR-A11Y-03 | NFR-PERF-09 | A8 |
| NFR-SEO-07 | Icons and manifest. | Must | • SVG favicon plus a 32 px PNG fallback, a 180 px Apple touch icon, and a web manifest with 192 and 512 px icons | Phase 06 | ASSET_INVENTORY (16 px favicon only) |
| NFR-SEO-08 | No obsolete metadata. | Should | • `keywords`, `COPYRIGHT`, `ICBM`, `geo.*`, `rating` and `distribution` are not emitted | — | Audit §4 |
| NFR-SEO-09 | 404 handling. | Should | • Unknown paths return HTTP 404 with `noindex` (FR-ERR-01) | FR-ERR-01 | Audit §4 |

## 4. Security and privacy (SEC)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| NFR-SEC-01 | HTTPS everywhere. | Must | • All traffic over HTTPS; HTTP 301s to HTTPS<br>• HSTS `max-age` ≥ 31536000 with `includeSubDomains` | Phase 12 | Audit §8 |
| NFR-SEC-02 | Content Security Policy (amended 2026-11-04 by [ADR 0008](../architecture/adr/0008-csp-for-static-pages.md)). | Must | • CSP sets `default-src 'self'`; `script-src 'self' 'unsafe-inline'` (required for statically rendered App Router pages; no third-party script origins)<br>• `connect-src` and `form-action` are self plus the form provider; `img-src` self, `data:` and `blob:`<br>• `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`<br>• No CSP violations in the console<br>• Phase 11 evaluates replacing `'unsafe-inline'` with CSP **hash sources** for all inline scripts (Next.js bootstrap and theme), with SRI considered separately for external scripts; this policy stays until that evaluation is accepted (ADR 0008) | Phase 05 (provider domain), ADR 0008 | Audit §8 |
| NFR-SEC-03 | Security headers. | Must | • `X-Content-Type-Options: nosniff`<br>• `Referrer-Policy: strict-origin-when-cross-origin`<br>• `Permissions-Policy` disables camera, microphone and geolocation<br>• **Should:** grade A or better on securityheaders.com | Phase 12 | Audit §8 |
| NFR-SEC-04 | Safe external links. | Must | • Every `target="_blank"` link has `rel="noopener noreferrer"` | FR-PRJ-03, FR-SOC-01 | Audit §8 |
| NFR-SEC-05 | No secrets in the repository or client bundle. | Must | • No API keys or tokens committed (public repo)<br>• Environment variables live only in ignored `.env*` files<br>• Only intentionally public values are exposed to the client | — | GI, R2 |
| NFR-SEC-06 | Dependency hygiene. | Must | • `npm audit` reports no high or critical vulnerabilities at release<br>• `package-lock.json` is committed<br>• Dependencies are pinned to exact or caret versions per Phase 05 policy | Phase 06 | GI |
| NFR-SEC-07 | Form abuse protection. | Must | • Honeypot (FR-CON-05)<br>• Server- or provider-side validation and spam filtering<br>• Length limits enforced (FR-CON-03)<br>• User input is never rendered as HTML on the site | Phase 05 | — |
| NFR-SEC-08 | No tracking. | Must | • No cookies are set<br>• No analytics or tracking scripts (D21)<br>• `localStorage` is used only for the theme preference | — | D21 |
| NFR-SEC-09 | Personal data exposure is limited to what the owner approved. | Must | • Only the approved contact data is published (one phone number, one email; D4)<br>• No email in metadata (the `COPYRIGHT` meta tag is removed) | CONTENT_SCHEMA | D4, Audit §4 |

## 5. Maintainability (MNT)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| NFR-MNT-01 | TypeScript strict mode. | Must | • `strict: true`, `noUncheckedIndexedAccess: true`<br>• No `any` without an inline justification comment<br>• `tsc --noEmit` passes | Phase 06 | GI |
| NFR-MNT-02 | Linting and formatting. | Must | • ESLint (Next.js config plus `jsx-a11y`) and Prettier configured<br>• Zero lint errors; formatting is enforced | Phase 06 | GI |
| NFR-MNT-03 | Content is separated from presentation. | Must | • All copy, links and image metadata live in one typed content source that follows [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md)<br>• Content updates (e.g. a new project URL) require no component changes<br>• The content is type-checked at build time | Phase 05 | GI, D6 |
| NFR-MNT-04 | Reusable, modular components. | Must | • Shared primitives (Section, Heading, Button/Link, Card, Icon, etc.) are used across sections<br>• No duplicated markup patterns between sections | Phase 05, 06 | GI |
| NFR-MNT-05 | Minimal dependencies. | Must | • Every runtime dependency is justified in the architecture docs<br>• No jQuery, carousel, animation or UI-kit libraries without explicit approval | Phase 05 | GI, P5 |
| NFR-MNT-06 | Automated tests. | Should | • Component or unit tests for the navigation menu, theme toggle, project filter and contact-form validation<br>• An end-to-end smoke test of the key flows (Playwright)<br>• Tests run in CI | Phase 11 | GI |
| NFR-MNT-07 | Continuous integration. | Must | • On every PR: lint, typecheck and build must pass before merge (GitHub Actions) | Phase 06 | GI |
| NFR-MNT-08 | Documentation. | Must | • README covers setup, scripts and how to update content<br>• Architecture and decisions documented<br>• PROJECT_STATUS.md kept current | — | GI |
| NFR-MNT-09 | Code conventions. | Should | • Conventional Commits; PR template used; a consistent folder structure (Phase 05) | — | ENGINEERING_WORKFLOW |

## 6. Responsive behaviour (RSP)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| NFR-RSP-01 | The layout works from 320 to 2560 px. | Must | • No horizontal scrolling at any width in that range<br>• Content width is capped by a max-width container | Phase 04 | Audit §7 (375 px overflow) |
| NFR-RSP-02 | Breakpoints are verified. | Must | • Visual check at 320, 375, 768, 1024, 1280, 1440 and 1920 px<br>• Breakpoints are defined as tokens in Phase 04 | Phase 04 | — |
| NFR-RSP-03 | Orientation. | Must | • Works in portrait and landscape on phones and tablets (1.3.4) | — | WCAG 1.3.4 |
| NFR-RSP-04 | No hover-only interactions. | Must | • Anything revealed on hover is also available on focus and tap<br>• No essential information exists only on hover | — | Audit §11 (hover overlay) |
| NFR-RSP-05 | Responsive images. | Must | • Images scale to their container and serve size-appropriate files (NFR-PERF-06) | Phase 06 | P1 |
| NFR-RSP-06 | Fluid typography. | Should | • Headings use fluid sizing (`clamp()`); body text ≥ 16 px on mobile | Phase 04 | REF (Adopt) |

## 7. Browser compatibility (BRW)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| NFR-BRW-01 | Supported browsers. | Must | • The latest 2 major versions of Chrome, Edge, Firefox and Safari (macOS); Safari on iOS; Chrome on Android<br>• **Should:** the latest Samsung Internet<br>• Internet Explorer is not supported | — | — |
| NFR-BRW-02 | Clean console. | Must | • No errors or warnings in the console in supported browsers (production build) | — | Audit §9 |
| NFR-BRW-03 | Progressive enhancement. | Must | • With JS disabled, all content, anchors, the CV link, `tel:`/`mailto:` links and project links work<br>• The menu degrades to visible links<br>• The form follows FR-CON-06 (Should) | FR-CON-06, FR-PRJ-02 | A11 |
| NFR-BRW-04 | Forced-colours mode. | Should | • In Windows High Contrast / `forced-colors: active`, focus indicators, buttons and borders stay visible | — | Accessibility best practice |
