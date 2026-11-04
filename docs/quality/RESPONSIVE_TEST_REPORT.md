# Responsive Test Report

**Phase:** 10 — Accessibility & Responsive Engineering
**Date:** 2026-11-04
**Requirements:** NFR-RSP-01–06, NFR-BRW-01/03, DESIGN_SYSTEM §2 (breakpoints) and §4 (project rhythm)
**Build tested:** production build of branch `phase/10-accessibility-responsive`, after the Phase 10 fixes

## 1. Summary

- **36 width runs** (12 widths × Chromium, Firefox and WebKit) and **10 device profiles** (5 devices, portrait and landscape): **no horizontal scrolling anywhere**, including in every project-filter state.
- **Engines agree:** Chromium, Firefox and WebKit produce the same layout at every width. Header controls, grid columns and the contact layout are identical.
- **Breakpoints:** every layout switch happens where DESIGN_SYSTEM §2 places it (§3).
- **Typography:** body text is ≥ 16 px at every width and scales fluidly to 17 px; headings scale with `clamp()` (NFR-RSP-06).
- **Fixed in this phase** (details in [ACCESSIBILITY_REPORT.md §5](ACCESSIBILITY_REPORT.md#5-findings-fixed-in-this-phase)):
  - the hero at 320 px with text-spacing overrides;
  - the footer and back-to-top overlap at ≥ 1280 px;
  - 44 px social-link targets.
- **Open:** real devices and real Safari over HTTPS (Phase 12); Firefox and WebKit in CI (Phase 11).

## 2. Method

| Item | Detail |
|---|---|
| Engines | Chromium 156, Firefox 157, WebKit 27.2 (Playwright 1.64.1, Windows 11) |
| Widths | Mobile 320 / 360 / 375 / 414 · Tablet 768 / 820 · Laptop 1024 / 1280 / 1366 · Desktop 1440 / 1920 / 2560 |
| Devices (emulated) | iPhone SE, iPhone 14, iPad Mini, iPad Pro 11 (WebKit); Pixel 7 (Chromium); each in portrait and landscape, with touch and device pixel ratio |
| Measured | Horizontal overflow (default and per filter); header controls shown; grid columns per section; contact layout; header height; `h1` / `h2` / body font sizes; container width |
| Interactions | Menu open and close (tap), project filters, contact form failure and success paths (Formspree intercepted), theme toggle |
| Visual review | Full-page screenshots at 320 / 768 / 1024 / 1440 / 2560 px and device screenshots, reviewed by eye. They are not committed; the automated checks below reproduce the measurements. |
| WebKit harness | Plain-HTTP localhost plus the CSP's `upgrade-insecure-requests` makes WebKit load no CSS, fonts or images. The WebKit runs strip that directive from the document **in the test harness only**; production is HTTPS (see the accessibility report, §2). |

## 3. Results by width

Identical in Chromium, Firefox and WebKit.

| Width | Header (controls shown) | Projects | Services | Skills | Testimonials | Contact | `h1` / `h2` px | Overflow |
|---|---|---|---|---|---|---|---|---|
| 320 | Wordmark · theme · menu | 1 col | 1 | 1 | 1 | Stacked | 56 / 36 | 0 |
| 360 | Same | 1 col | 1 | 1 | 1 | Stacked | 56 / 36 | 0 |
| 375 | Same | 1 col | 1 | 1 | 1 | Stacked | 57 / 36 | 0 |
| 414 | Same | 1 col | 1 | 1 | 1 | Stacked | 61 / 37 | 0 |
| 768 | + Download CV | 2-up, staggered | 2×2 | 2 | 1 | Stacked | 92 / 47 | 0 |
| 820 | Same | 2-up, staggered | 2×2 | 2 | 1 | Stacked | 96 / 48 | 0 |
| 1024 | Same | Asymmetric 7/5 · 5/7 | 2×2 | 3 | 2 | Details 5 + form 7 | 114 / 53 | 0 |
| 1280 | Inline nav · theme · CV (no menu) | Asymmetric | 2×2 | 3 | 2 | 5 + 7 | 136 / 60 | 0 |
| 1366 | Same | Asymmetric | 2×2 | 3 | 2 | 5 + 7 | 144 / 62 | 0 |
| 1440 | Same | Asymmetric | 2×2 | 3 | 2 | 5 + 7 | 150 / 64 | 0 |
| 1920 | Same; content capped at 1440 | Asymmetric | 2×2 | 3 | 2 | 5 + 7 | 150 / 64 | 0 |
| 2560 | Same; content capped at 1440 | Asymmetric | 2×2 | 3 | 2 | 5 + 7 | 150 / 64 | 0 |

**Header height:** 64 px below 768 px and 72 px from 768 px, plus a 1 px rule (spec §2).

**Body text:** 16.0 px at 320 px, rising to 17 px at 1440 px and above. The only 15 px text is the Experience date lines, which use the spec's `ui` style for metadata (spec §12), so this is by design.

## 4. Results by device

| Device | Engine | Viewport | Overflow | Header | Menu (tap) | Projects |
|---|---|---|---|---|---|---|
| iPhone SE | WebKit | 320×568 | 0 | Menu | Opens and closes | 1 col |
| iPhone SE landscape | WebKit | 568×320 | 0 | Menu | Opens and closes | 1 col |
| iPhone 14 | WebKit | 390×664 | 0 | Menu | Opens and closes | 1 col |
| iPhone 14 landscape | WebKit | 750×340 | 0 | Menu | Opens and closes | 1 col |
| Pixel 7 | Chromium | 412×839 | 0 | Menu | Opens and closes | 1 col |
| Pixel 7 landscape | Chromium | 863×360 | 0 | Menu + CV | Opens and closes | 2-up |
| iPad Mini | WebKit | 768×1024 | 0 | Menu + CV | Opens and closes | 2-up |
| iPad Mini landscape | WebKit | 1024×768 | 0 | Menu + CV | Opens and closes | Asymmetric |
| iPad Pro 11 | WebKit | 834×1194 | 0 | Menu + CV | Opens and closes | 2-up |
| iPad Pro 11 landscape | WebKit | 1194×834 | 0 | Menu + CV | Opens and closes | Asymmetric |

**Contact form on iPhone 14 (WebKit, tap):**
- **Failure response:** shows "Sorry, your message couldn't be sent. Please try again or email khan.shahrukh156@gmail.com." and keeps the input.
- **Confirmed success:** shows "Thank you! Your message has been sent." and clears the form.

## 5. Component checks

| Area | Checked | Result |
|---|---|---|
| **Navigation** | Inline nav at ≥ 1280 px; menu below that; the menu's focus trap, inert page, Esc and Close, link to section; current-section underline; links from the 404 page; no-JS inline nav | ✅ |
| **Cards** | Project frames 16:10 / 4:3 per breakpoint; `cover` vs `contain` images; asymmetric offsets (+96 / +64 px desktop, +48 px tablet); unpaired card spans 7; every filter state | ✅ (geometry asserted in `tests/e2e/projects.spec.ts`) |
| **Typography** | Fluid `h1` 56 → 150 px and `h2` 36 → 64 px; body ≥ 16 px; text-spacing overrides; 200% text; long words at 320 px | ✅ (after fix A11Y-06) |
| **Forms** | Labels above fields; 52 px inputs; errors under fields; counter; status panels; stacked below 1024 px, 5 + 7 above; tap targets ≥ 44 px | ✅ |
| **Grid transformations** | Services 1 → 2×2; Skills 1 → 2 → 3; Testimonials 1 → 2; Contact stacked → 5 + 7; hero stacked → 5 + 3 → 8 + 4 | ✅ |
| **Interactive controls** | Theme toggle at every width and in the menu; filter chips wrap without scrolling; disclosure; back-to-top clears the footer links; buttons keep outlines in forced colours | ✅ |
| **Orientation** | Phones and tablets in landscape; no orientation lock | ✅ |
| **Large screens** | 1920 and 2560 px: content capped at 1440 px and centred; no stretched lines | ✅ |

## 6. Findings and fixes

| ID | Finding | Fix |
|---|---|---|
| RSP-01 (= A11Y-06) | 320 px plus text-spacing overrides: the hero's long word widened the column (5 px of horizontal scrolling) | Hero grid `minmax(0, 1fr)`; headings `overflow-wrap: break-word` |
| RSP-02 (= A11Y-04) | ≥ 1280 px at the end of the page: back-to-top partly covered the footer "Email" link | Footer bottom padding 96 px from 768 px; content `scroll-margin-bottom` |
| RSP-03 (= A11Y-05) | Social links 17–21 px tall | 44 px minimum height |
| RSP-04 | WebKit on plain-HTTP localhost loaded no CSS (1,328 px of "overflow") | Not a product defect: CSP `upgrade-insecure-requests` on HTTP. Test-harness workaround; production is HTTPS. |

## 7. Open items

| Item | Plan |
|---|---|
| Real devices (iPhone, Android) and real Safari over HTTPS | Phase 12, on the Vercel preview, together with your screen-reader smoke test |
| Firefox and WebKit in CI (local only in this phase) | Phase 11 browser matrix, with the WebKit CSP harness |
| Samsung Internet (NFR-BRW-01, Should) | Chromium-based; check on a real device in Phase 12 if one is available |

## 8. Automated regression coverage

| Spec | Responsive coverage |
|---|---|
| `tests/e2e/core.spec.ts` | Header per breakpoint (375 / 800 / 1440); no overflow at 320 / 375 / 768 / 1024 / 1280 / 1440 |
| `tests/e2e/projects.spec.ts` | Filter states at 375 / 800 / 1280; grid geometry and frame ratios per breakpoint |
| `tests/a11y/robustness.spec.ts` | Landscape 568×320, 844×390, 1194×834; 2560 px; text spacing at 320 px; 200% text; target sizes at 375 / 1280; back-to-top clearance at 375 / 1280 / 1440 |
| `tests/a11y/keyboard.spec.ts` | Full keyboard walk at 375 and 1280 px |
