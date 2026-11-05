# Typography

**Phase:** 04 — UI/UX Research & Design System
**Date:** 2026-11-03

**Requirements served:** NFR-PERF-07 (fonts), NFR-RSP-06 (fluid type), NFR-A11Y-10 (resize, reflow, text spacing), DS-04.

---

> **Phase 11.5 update (2026-11-05):** Andika 400/700 (`next/font/google`, self-hosted at build time) replaces Fraunces and Inter for every role ([ADR 0014](../architecture/adr/0014-dark-only-theme-and-andika.md)). The scale tokens are in `globals.css` (`--text-hero` clamp(3.5rem, 9.4vw, 8.25rem), `--text-h2` clamp(2.25rem, 4.8vw, 3.75rem), and so on). The families and specimens below are historical.

## 1. Families

| Role | Family | Licence | Axes used | Weights used | Fallback stack |
|---|---|---|---|---|---|
| Display and headings | **Fraunces** (roman only) | SIL OFL 1.1 | `opsz` 9–144 (automatic), `wght` | 500 (headings), 600 (wordmark) | `Georgia, "Times New Roman", serif` |
| Body, UI, labels | **Inter** | SIL OFL 1.1 | `wght` | 400 (body), 500 (labels, nav), 600 (buttons, emphasis) | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |

The previous site's Poppins is retired. The reference site's Syne and Poppins are not used.

## 2. Loading strategy

| Rule | Detail |
|---|---|
| Self-hosted | Via `next/font/google` (Phase 06): files are fetched from Google **at build time only** and served from this site's origin; the browser never requests Google Fonts (NFR-PERF-07; see [ARCHITECTURE.md §10](../architecture/ARCHITECTURE.md#10-font-loading)) |
| Files | **2 variable font files** (Fraunces roman, Inter), Latin subset only. **No italic files** (DS-04). |
| Display | `font-display: swap`, with size-adjusted fallbacks (`next/font` `adjustFontFallback`) to limit CLS (NFR-PERF-02) |
| Preload | Both files are preloaded: the hero uses Fraunces (h1) and Inter (title line) |
| Optical sizing | `font-optical-sizing: auto` on Fraunces, so large sizes get display cuts and small sizes text cuts |
| Emphasis | No faux italics: emphasis uses weight (Inter 600) or colour (`text-muted`), never synthetic oblique |

## 3. Type scale

Fluid values interpolate linearly between a **360 px** and a **1440 px** viewport. The formula is `clamp(min, intercept + slope·vw, max)`.

| Token | Family / weight | Min (360) | Max (1440) | CSS | Line height | Tracking | Used for |
|---|---|---|---|---|---|---|---|
| `display` | Fraunces 500 | 56 px | 150 px | `clamp(3.5rem, 1.542rem + 8.704vw, 9.375rem)` | 0.92 | −0.025em | Hero name (`h1`) |
| `display-2` | Fraunces 500 | 44 px | 112 px | `clamp(2.75rem, 1.333rem + 6.296vw, 7rem)` | 0.95 | −0.025em | "Let's get in touch", 404 code |
| `h2` | Fraunces 500 | 36 px | 64 px | `clamp(2.25rem, 1.667rem + 2.593vw, 4rem)` | 1.05 | −0.02em | Section headings |
| `h3-lg` | Fraunces 500 | 24 px | 30 px | `clamp(1.5rem, 1.375rem + 0.556vw, 1.875rem)` | 1.15 | −0.01em | Experience company, CTA band heading support |
| `h3` | Fraunces 500 | 24 px | 32 px | `clamp(1.5rem, 1.333rem + 0.741vw, 2rem)` | 1.12 | −0.01em | Project card titles, service titles |
| `quote` | Fraunces 400 | 20 px | 24 px | `clamp(1.25rem, 1.167rem + 0.370vw, 1.5rem)` | 1.45 | 0 | Testimonials |
| `lead` | Inter 400 | 18 px | 20 px | `clamp(1.125rem, 1.083rem + 0.185vw, 1.25rem)` | 1.65 | 0 | About summary, hero location |
| `title-line` | Inter 500 | 18 px | 26 px | `clamp(1.125rem, 0.958rem + 0.741vw, 1.625rem)` | 1.5 | 0 | Highlighted hero title |
| `body` | Inter 400 | 16 px | 17 px | `clamp(1rem, 0.979rem + 0.093vw, 1.0625rem)` | 1.6 | 0 | Paragraphs, highlights, form text |
| `ui` | Inter 500/600 | 15 px | 15 px | `0.9375rem` | 1.2 | 0 | Nav, buttons, chips |
| `small` | Inter 400 | 14 px | 14 px | `0.875rem` | 1.5 | 0 | Meta lines, notes, form help and errors |
| `label` | Inter 500, uppercase | 13 px | 13 px | `0.8125rem` | 1.3 | +0.12em | Section index ("01 — About"), card meta ("07 · Website"), group labels |
| `wordmark` | Fraunces 600 | 20 px | 22 px | `clamp(1.25rem, 1.208rem + 0.185vw, 1.375rem)` | 1 | −0.01em | Header name |

**Minimum sizes:** body text is never below 16 px. Uppercase labels (13 px) are used only for short metadata, never for sentences.

## 4. Hierarchy per section

| Section | Eyebrow | Heading | Body |
|---|---|---|---|
| Hero | `label` "Portfolio" | `display` h1 "Mohd Shahrukh" (2 lines) | `title-line` on the accent highlight; `lead` location |
| About | `label` "01 — About" | `h2` "Know Me More" | `lead` summary; key facts in `label` + `body` |
| Services | `label` "02 — Services" | `h2` | `h3` titles + `body` |
| Experience | `label` "03 — Experience" | `h2` "My Experience" | Dates in `ui` (tabular); `h3-lg` company; `body` highlights |
| Skills | `label` "04 — Skills" | `h2` "My Skills" | Group label `label`; skills `body` |
| Certifications / Education | `label` "05 —" / "06 —" | `h2` | Name `h3`; issuer `small` muted |
| Projects | `label` "07 — Projects" | `h2` | Meta `label`; title `h3`; subtitle `body` muted; notes `small` |
| CTA band | — | `h2` "Interested in working with me?" | — |
| Testimonials | `label` "08 — Testimonials" | `h2` | `quote`; name `ui` 600; role `small` muted |
| Contact | `label` "09 — Contact" | `display-2` "Let's get in touch" | `lead` intro; form `body` |

## 5. Text details

| Rule | Value |
|---|---|
| Measure | Body paragraphs max **68ch**; the summary (`lead`) max **62ch**; highlight lists max **72ch** |
| Numerals | `font-variant-numeric: tabular-nums` for dates, indices and the character counter |
| Wrapping | `text-wrap: balance` on headings ≤ 4 lines; `text-wrap: pretty` on paragraphs (progressive) |
| Hyphenation | Off (`hyphens: manual`) |
| Hero name break | "Mohd" / "Shahrukh" on two lines at every width (a `<br>` inside the `h1`; accessible name unchanged) |
| Links in text | Underline 1 px, offset 4 px; 2 px on hover; colour = surrounding text |
| Text spacing | Layouts must survive the WCAG 1.4.12 overrides (line height 1.5, paragraph spacing 2em, letter 0.12em, word 0.16em): no fixed-height text containers |
| Zoom | All sizes are `rem`-based, so 200% browser zoom scales everything (NFR-A11Y-10) |

## 6. Specimen (reference values at 1440 / 375)

| Token | 1440 px | 375 px |
|---|---|---|
| `display` | 150 px | 57 px |
| `display-2` | 112 px | 45 px |
| `h2` | 64 px | 36 px |
| `h3` | 32 px | 24 px |
| `lead` | 20 px | 18 px |
| `body` | 17 px | 16 px |
