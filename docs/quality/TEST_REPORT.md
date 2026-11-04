# Test Report

**Phase:** 11 — Performance, SEO & Quality Assurance
**Date:** 2026-11-04
**Branch:** `phase/11-performance-seo-qa`
**Scope:**
- unit, component, content-invariant, end-to-end, navigation, form and accessibility tests;
- production build, TypeScript, ESLint, Prettier, dependency audit and JS budget.

All results below are from actual runs. The PR's CI run (GitHub Actions, Ubuntu) repeats every check.

## 1. Summary

| Check | Command | Result |
|---|---|---|
| Formatting | `npm run format:check` (Prettier 3) | ✅ All files formatted |
| Lint | `npm run lint` (ESLint 9.39.5, core-web-vitals + TypeScript + jsx-a11y) | ✅ 0 problems |
| Type check | `npm run typecheck` (`next typegen` + `tsc --noEmit`, TypeScript 6.0.3 strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) | ✅ 0 errors |
| Unit, component and content tests | `npm test` (Vitest 5, jsdom) | ✅ **187 passed** in 29 files |
| Production build | `npm run build` (Next.js 16.4.5, Turbopack) | ✅ 10 static outputs, 0 dynamic routes |
| JS budget | `npm run size` | ✅ 144.8 KB gzip (budget 150; project code about 7.9 KB, allowance 15 KB) |
| End-to-end and accessibility | `npm run test:e2e` (Playwright 1.64, axe-core 4.14) | ✅ **344 passed, 7 skipped, 0 failed**: 117 tests × Chromium 156, Firefox 157, WebKit 27.2 |
| Dependency audit | `npm audit --audit-level=high` | ✅ 0 high or critical (17 moderate in dev tooling only; production dependencies: 0) |

Code coverage percentages are **not measured**: the coverage plugin isn't installed, and the project keeps its dependencies minimal. The coverage below is described by behaviour and requirement instead.

## 2. Unit and component tests (Vitest)

| Area | Files | Tests | Covers |
|---|---|---|---|
| Content invariants | `content.test.ts`, `ui-copy.test.ts` | 21 | Required fields; link status (live / pending / none); experience order and dates; unique ids; URL formats; metadata lengths; exactly ten projects; owner decisions D1–D21; section indices; alt text |
| Pure logic (`src/lib`) | 11 files | 79 | `cn`, dates, links, project layout per filter state (DS-07), project view and image fit (DS-08), section navigation and legacy anchors, theme script and storage, contact validation, Formspree submission (success **only** on 2xx + `ok: true`; 422 / 429 / 403 / 500 / unexpected body / network / timeout → error), structured data (no phone or email; `<` escaped) |
| UI primitives | Button, ExternalLink, SectionHeader, IconBase | 12 | Variants; `rel` / new-tab announcement; heading structure; decorative icons |
| Layout | MobileMenu, SiteHeader / Footer, SkipLink, ThemeToggle | 22 | Menu focus trap, inert, Esc / Close, focus return; header contents; theme toggle (persist, follow the system until chosen, blocked storage, sync on mount) |
| Sections | Hero, About, Services, Experience, Skills / Certifications / Education, Projects, Testimonials / hire band, Contact | 58 | Content word for word; heading levels; filter (`aria-pressed`, polite status, keyboard); disclosure (pre-paint collapse, `aria-expanded`); form validation, sending, success / failure paths, honeypot, counter, no-JS markup |
| Disclosure | HighlightsDisclosure | 4 | Server HTML has every item, with the extras marked `js-collapsed`; expand / collapse; focus kept |
| **Total** | **29 files** | **187** | |

## 3. End-to-end, navigation, form and accessibility tests (Playwright)

| Spec | Tests per engine | Covers |
|---|---|---|
| `e2e/foundation.spec.ts` | 13 | Static render without console errors or CSP violations; skip link; theme bootstrap; fonts self-hosted; CV served as PDF; 404 with `noindex`; **metadata, Open Graph image 1200×630, structured data, robots / sitemap / manifest icons**; security headers; no-JS |
| `e2e/core.spec.ts` | 24 | Section order; **zero unresolved internal links**; header per breakpoint; desktop nav lands below the header; mobile menu (focus, inert, scroll lock, Esc / Close, link → section, contents, axe both themes); 404 navigation; experience disclosure; CV links; no-JS; no overflow at 6 widths |
| `e2e/projects.spec.ts` | 17 | Filter at 375 / 800 / 1280 px; asymmetric grid geometry per breakpoint and state; single external link; lazy images; hover zoom and reduced motion; hero and nav links; hire band; testimonials; no-JS; axe with a filter applied |
| `e2e/interactions.spec.ts` | 21 | Theme (persist, no flash, system follow, blocked storage, menu toggle, no-JS); current section (desktop and menu); legacy anchors; back to top; header focus never scrolls; focus not obscured; **contact form** (validation focus, success only after confirmation, 500 / 403 / network failure keeps input and offers email, axe with errors and alert; no-JS native validation and POST). Formspree is **always intercepted**; no real submission. |
| `e2e/performance.spec.ts` | 3 | **No layout shift while hydrating when loaded at #experience** (CLS < 0.01); highlights collapsed in server HTML with JS; LCP portrait preload and priority |
| `a11y/axe.spec.ts` | 24 | axe WCAG 2.0–2.2 A/AA: home and 404, both themes, at 320 / 375 / 768 / 1024 / 1280 / 1440 px |
| `a11y/keyboard.spec.ts` | 4 | Full Tab walk at 375 / 1280 px (outline, visible, not under the header or covered, DOM order, reachability); Shift+Tab back |
| `a11y/robustness.spec.ts` | 11 | Target size ≥ 24 px; forced colours; text spacing at 320 px; 200% text; landscape and 2560 px; landmarks with the menu open; back-to-top clearance |
| **Total** | **117 × 3 engines = 351** | **344 passed, 7 skipped, 0 failed** (14.3 min locally, 1 worker) |

### Skipped tests (7), and why

| Test | Engine | Reason |
|---|---|---|
| Keyboard walk at 375 and 1280 px (2 tests each, 4 total) | WebKit | Like Safari with default settings, WebKit's Tab key skips links. Link tab order is verified in Chromium and Firefox, and on real Safari in Phase 12. |
| Skip link is the first Tab stop | WebKit | Same reason (the skip link is a link) |
| No layout shift while hydrating | Firefox, WebKit | The Layout Instability API is Chromium-only |

**Engine differences handled in the tests:**
- **Focus retention:** WebKit doesn't focus a button on mouse click, like Safari. The checks that focus stays on the filter chip, theme toggle and disclosure therefore activate the control with the **keyboard**, which is the behaviour the requirements describe.
- **WebKit on plain-HTTP localhost:** the CSP directive `upgrade-insecure-requests` makes WebKit rewrite every request to `https`, so a local test loads no CSS. A shared fixture (`tests/fixtures.ts`) removes **only that directive** from the document response, **for WebKit only**. Production is HTTPS, and the header in `next.config.ts` is unchanged.

## 4. Continuous integration

`.github/workflows/ci.yml` runs on every pull request and every push to `main`:

1. `npm ci`
2. `npm audit --audit-level=high`
3. Format check
4. Lint
5. Type check
6. Vitest
7. Production build
8. JS budget
9. `playwright install --with-deps chromium firefox webkit` (**three engines since Phase 11**)
10. E2E and accessibility suite: 2 workers, 1 retry, HTML report uploaded on failure

The job timeout was raised from 20 to 35 minutes for the extra engines.

## 5. Known limitations

| Item | Plan |
|---|---|
| No real screen-reader run | Owner smoke test (ACCESSIBILITY_REPORT §7) |
| No real devices, no real Safari over HTTPS | Phase 12, on the live preview |
| No live Formspree delivery test (owner decision 4b) | Owner sends one message from the live site after Phase 12 |
| One flaky timeout seen once locally in Phase 10, under memory pressure | Not seen since; CI retries once |
