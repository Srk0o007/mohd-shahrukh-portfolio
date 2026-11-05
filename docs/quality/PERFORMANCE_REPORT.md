# Performance Report

**Phase:** 11 — Performance, SEO & Quality Assurance
**Date:** 2026-11-04
**Requirements:** NFR-PERF-01–09 (Core Web Vitals, JS budget, images, fonts, rendering)
**Build tested:** production build (`next build` + `next start`, localhost) of branch `phase/11-performance-seo-qa`

> **Read this first.** Every number below comes from an actual run on this machine. The Lighthouse figures are **lab** results. The real-user data Google uses for Core Web Vitals doesn't exist until the live site has traffic (Phase 12 onwards). This is a memory- and CPU-constrained development machine, and its speed changed during the session. Each result therefore carries Lighthouse's **benchmark index**, the host CPU speed it measured (higher is faster).

## 1. Summary

| | Before Phase 11 changes (benchmark index about 2,100) | After Phase 11 changes (index about 2,100 runs; see §3) |
|---|---|---|
| **Desktop** Lighthouse Performance | 100 | **100** |
| **Mobile** Lighthouse Performance | 90 | **91** |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 | **100 / 100 / 100** (every run, both form factors) |
| CLS | 0.000 | **0.000**, plus the hydration shift fixed for visitors who arrive scrolled down (§4) |
| First-load JS | 144.0 KB gzip | **144.8 KB** (project code about 7.9 KB above the 136.9 KB framework baseline) |
| Full page, scrolled to the end | — | **About 0.5 MB transferred** (0.94–1.04 MB uncompressed); budget 1.5 MB |

**Later in the session the machine slowed to about half speed** (benchmark index about 950). Mobile then measured **80–81 for both the Phase 11 build and the unchanged `main` build**, in an interleaved A/B run under identical conditions (§3). So the drop came from the host, not the site. Desktop stayed at 100.

## 2. Method

| Item | Detail |
|---|---|
| Tool | Lighthouse **12.8.2** via `npx` (not a project dependency), headless Chromium 156 (Playwright build) |
| Mobile | Lighthouse default: Moto G Power emulation, simulated slow 4G (150 ms RTT, about 1.6 Mbps), 4× CPU slowdown |
| Desktop | `--preset=desktop` |
| Runs | 3 or 5 per configuration; **medians** reported |
| Page | `/`, the only indexable page |
| Server | `next start` on localhost. Production on Vercel adds a CDN, HTTP/2 or 3 and Brotli, so lab numbers there will differ (expected to be no worse). |

## 3. Lighthouse results (medians)

| Batch | Build | Form | n | Perf | A11y | BP | SEO | FCP ms | LCP ms | TBT ms | CLS | Bytes | Benchmark |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Baseline | `main` (Phase 10) | Mobile | 3 | 90 | 100 | 100 | 100 | 922 | 3,218 | 182 | 0 | 326 KB | 2,080 |
| Baseline | `main` | Desktop | 3 | 100 | 100 | 100 | 100 | 256 | 670 | 0 | 0 | 326 KB | 2,103 |
| Phase 11 (image preload) | Phase 11 | Mobile | 5 | **91** | 100 | 100 | 100 | 944 | 3,216 | 153 | 0 | 326 KB | 2,131 |
| Phase 11 (image preload) | Phase 11 | Desktop | 5 | **100** | 100 | 100 | 100 | 258 | 669 | 0 | 0 | 326 KB | 2,108 |
| Final build, slowed host | Phase 11 + SEO | Mobile | 5 | 80 | 100 | 100 | 100 | 1,161 | 3,454 | 446 | 0 | 329 KB | 931 |
| Final build, slowed host | Phase 11 + SEO | Desktop | 5 | **100** | 100 | 100 | 100 | 296 | 766 | 43 | 0 | 329 KB | 954 |
| **A/B, interleaved** | `main` | Mobile | 5 | 80 | — | — | — | 1,128 | 3,437 | 436 | 0 | — | 946 |
| **A/B, interleaved** | Phase 11 | Mobile | 5 | 81 | — | — | — | 1,156 | 3,427 | 417 | 0 | — | 950 |
| Phase 11.5 (dark redesign) | Phase 11.5 | Mobile | 3 | **88** | 100 | 100 | 100 | 986 | 2,933 | 248 | 0 | 270 KB | 2,599 |
| Phase 11.5 (dark redesign) | Phase 11.5 | Desktop | 3 | **100** | 100 | 100 | 100 | 274 | 640 | 0 | 0 | 265 KB | 2,483 |

"Final build" adds SEO assets on top of the image-preload build: JSON-LD (about 0.6 KB of HTML) and metadata tags. **The interleaved A/B rows** alternate `main` and Phase 11 runs on the same host minutes apart. They show **no regression**: 81 vs 80, and LCP and TBT equal within noise.

**Mobile LCP (about 3.2 s in the 2,100-index runs):**
- **What it is:** the hero portrait (an 18 KB AVIF at 640 w).
- **Measured without throttling:** the observed LCP was **0.4 s**.
- **Where the 3.2 s comes from:** Lighthouse's simulation charges everything that loads before LCP to the throttled network and CPU, mainly the 145 KB of framework JavaScript and two fonts (115 KB).
- **Lighthouse's rating:** "needs improvement" against the 2.5 s "good" threshold. The overall mobile score of 90–91 is in the "good" band.

**Phase 11.5 (2026-11-05):**
- **Mobile score:** 88 (vs 91).
- **LCP:** better, 2.9 s (vs 3.2 s).
- **TBT:** 248 ms (vs 153 ms). The long tasks are React hydration (also present before) and the particle-wave engine's first setup, a 115 ms task at about 3.0 s.
- **Why the setup counts:** `ParticleWaveLayer` forces boot within 1.5 s of idle (ADR 0015), so the task falls inside Lighthouse's TBT window.
- **Desktop:** 100 / 100 / 100 / 100.
- **First-load JS:** 147.2 KB gzip (cap 150 KB). Project code is about 10.3 KB above the framework baseline (allowance 15 KB).
- **Lazy chunks:** the wave (3.8 KB) and motion (1.3 KB) are not counted in first-load JS.

## 4. Changes made, and experiments that were rejected

| # | Change | Result | Decision |
|---|---|---|---|
| P1 | **Highlights collapse before first paint**: `js-collapsed` class + `html[data-js]` CSS, button server-rendered `js-only` | Before, a visitor already scrolled to Experience saw the list collapse at hydration. Now **CLS < 0.01** in that scenario (Chromium Layout Instability API, E2E `performance.spec.ts`). Lighthouse CLS was already 0, because it measures from the top of the page. | ✅ Kept |
| P2 | **LCP image preload**: responsive `<link rel="preload" as="image" imagesrcset fetchpriority="high">` via React 19 `preload()` | Mobile 90 → 91 and TBT 182 → 153 ms, both within run-to-run noise; LCP unchanged | ✅ Kept (standard practice; what `next/image priority` does) |
| E1 | `experimental.inlineCss` (remove the render-blocking 8 KB stylesheet) | **Worse**: HTML grew 25 → 50 KB gzip, because the CSS is also embedded in the RSC payload; FCP 922 → 1,227 ms | ❌ Reverted |
| E2 | Inter without preload (leave bandwidth to the LCP image) | LCP unchanged (3,214 ms); FCP noisier | ❌ Reverted |
| E3 | `browserslist` limited to the supported browsers (NFR-BRW-01), to drop "legacy JavaScript" | **No change**: Next.js ships its polyfill module (`Array.prototype.at/flat/flatMap`, `Object.fromEntries`; about 14 KB raw / about 4 KB gzip) regardless | ❌ Reverted; recorded as framework-owned |

## 5. JavaScript (NFR-PERF-05)

| Script group | gzip |
|---|---|
| React DOM + scheduler | 71.5 KB |
| Next.js App Router runtime and client | 44.4 + 8.4 KB |
| Turbopack runtime | 4.3 KB |
| Small Next.js / shared chunks | about 9 KB |
| **Project code** (all islands: menu, theme, filter, disclosure, form, observers) | **about 7.9 KB** above the framework baseline |
| **Total first-load** | **144.8 KB** (budget 150 KB) |

- **Framework baseline:** **136.9 KB**, measured in Phase 06 on the same Next.js 16.4.5 / React 19.3 shell with no client components. The original 120 KB target couldn't be met even with zero project code.
- **The rule from now on (owner decision 1):** project code ≤ 15 KB above the baseline, and a hard 150 KB total. `npm run size` enforces both and prints the split.
- **Lighthouse "unused JavaScript" (about 52 KB):** all framework code, which loads in full for hydration.
- **Lighthouse "legacy JavaScript" (about 14 KB raw):** Next.js's built-in polyfill module (E3). Neither can be removed without leaving the App Router.

## 6. Images (NFR-PERF-06)

| Check | Result |
|---|---|
| Formats | AVIF, then WebP, via the Vercel / Next.js optimiser; Lighthouse `modern-image-formats` ✅ |
| Responsive sizes | `srcset` + `sizes` on every image; Lighthouse `uses-responsive-images` ✅ |
| Lazy loading | Every image except the LCP portrait (`loading="lazy"`; E2E checks) |
| Dimensions | Explicit `width` / `height` on every image (no layout shift) |
| LCP portrait | 18 KB AVIF at 640 w (mobile), `fetchpriority="high"`, eager, preloaded |
| **Whole page after a full scroll** | **About 213 KB of images** at 375 px @3×, 123 KB at 1440 px @1×, 227 KB at 1440 px @2× |
| **Total transfer after a full scroll** | **About 0.5 MB** (HTML 25 KB, JS 145 KB, CSS 8 KB gzip; fonts 113 KB; images as above). Uncompressed bodies total 0.94–1.04 MB. **Budget 1.5 MB ✅** |
| Source files | The original high-resolution PNGs (up to 1.6 MB) are never sent to browsers |

## 7. Fonts (NFR-PERF-07)

| Check | Result |
|---|---|
| Hosting | Self-hosted by `next/font` from this origin; **no request to Google** at runtime (E2E checks) |
| Files | 2 variable WOFF2 files: Fraunces (opsz, 67 KB) and Inter (48 KB) |
| Loading | `font-display: swap` with metric-matched fallbacks (no layout shift on swap: CLS 0); both preloaded |
| Lighthouse `font-display` | ✅ |

## 8. Rendering strategy (NFR-PERF-08/09)

- **All 10 outputs are prerendered at build time.** That's `/`, the 404 page, `robots.txt`, `sitemap.xml`, the manifest, `icon.svg`, the Apple icon, the two manifest icons and the social image. Nothing runs per request; the only runtime processing is Vercel's image optimiser (ADR 0002, ADR 0010).
- **Server Components by default.** Client code is limited to small islands; project cards are server-rendered (ADR 0013).
- **The stylesheet** is one 8 KB gzip file. Inlining it was measured and rejected (E1).

## 9. Core Web Vitals: status

| Metric | Lab result (this report) | "Good" threshold | Field data |
|---|---|---|---|
| LCP | Desktop 0.67–0.77 s ✅ · Mobile (simulated slow 4G, 4× CPU) 3.2 s at benchmark index 2,100, 3.4 s at 950 | ≤ 2.5 s | ⏳ After launch: Search Console / CrUX (about 28 days of traffic) |
| INP | Not measurable in a Lighthouse navigation run. TBT 0–46 ms desktop, 153–182 ms mobile (index 2,100) indicate a responsive main thread | ≤ 200 ms | ⏳ Field |
| CLS | **0.000** in every run; hydration shift fixed (P1) | ≤ 0.1 | ⏳ Field |

## 10. Follow-ups

1. **Phase 12:** run PageSpeed Insights against the live Vercel URL (real CDN, Brotli, HTTP/2). Record mobile and desktop alongside these lab numbers.
2. **After launch:** check Core Web Vitals field data in Search Console after about four weeks.
3. **If mobile LCP must reach ≤ 2.5 s in the lab simulation:** the remaining levers are product decisions, not code fixes:
   - a smaller hero portrait slot on mobile;
   - dropping the Fraunces optical-size axis (smaller font file, but a design change);
   - fewer client islands.
