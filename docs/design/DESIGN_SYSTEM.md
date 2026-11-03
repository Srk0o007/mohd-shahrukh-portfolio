# Design System

**Phase:** 04 — UI/UX Research & Design System
**Date:** 2026-11-03
**Direction:** A — Editorial Grid, with borrowings from C and B ([DESIGN_DIRECTION.md](DESIGN_DIRECTION.md))

This document defines the foundations. Colour is in [COLOR_TOKENS.md](COLOR_TOKENS.md), type in [TYPOGRAPHY.md](TYPOGRAPHY.md), and components in [COMPONENT_VISUAL_SPEC.md](COMPONENT_VISUAL_SPEC.md). Implementation (Tailwind theme, CSS variables) starts in Phase 06.

---

## 1. Principles

1. **Editorial hierarchy.** Scale, whitespace and alignment carry meaning; ornament does not.
2. **Scannable structure.** Numbered sections, dated rows and grouped lists.
3. **Restraint.** One accent colour, flat surfaces, motion only where it helps.
4. **Accessible by default.** WCAG 2.2 AA in both themes; reduced motion honoured; 44 px targets.
5. **Truthful.** Components render only verified content; empty optional fields collapse.
6. **Lightweight.** CSS-first, two font files, inline SVG icons, no UI or animation libraries.

## 2. Breakpoints

Mobile-first: styles apply from the breakpoint upward.

| Token | Min width | Typical devices | Layout notes |
|---|---|---|---|
| `base` | 0 | Phones (≥ 320) | 4-col grid, stacked sections, menu button |
| `sm` | 480 px | Large phones | 2-up key facts and services |
| `md` | 768 px | Tablets (portrait) | 8-col grid, 2-up projects with stagger, hero text and portrait side by side |
| `lg` | 1024 px | Tablets (landscape), small laptops | 12-col grid, asymmetric projects, section header split (3/9) |
| `xl` | 1280 px | Laptops and desktops | Inline nav (DS-03), full margins |
| `2xl` | 1536 px | Large desktops | Content capped by the container; only margins grow |

## 3. Layout grid

| Range | Columns | Gutter | Outer margin | Container |
|---|---|---|---|---|
| < 768 | 4 | 16 px | 20 px | Fluid |
| 768–1023 | 8 | 24 px | 32 px | Fluid |
| 1024–1279 | 12 | 24 px | 40 px | Fluid |
| ≥ 1280 | 12 | 32 px | 64 px | `max-width: 1440px` (content 1312 px), centred |

### Standard spans (≥ 1024)

| Pattern | Spans | Used by |
|---|---|---|
| Section header | Index label 1–3 · heading and content 4–12 | All content sections |
| Hero | Text 1–8 · portrait 9–12 (4:5) | Hero |
| Reading column | 4–10 | About summary, long text |
| Experience row | Dates 1–3 · content 4–12 | Experience |
| Projects (asymmetric) | Pairs of 7+5 and 5+7 with offsets (§4) | Projects |
| Contact | Details 1–5 · form 6–12 | Contact |
| Testimonials | 1–6 · 7–12 | Testimonials |

On mobile all spans collapse to full width. Offsets are removed below 768 px.

## 4. Asymmetric project rhythm (DS-07)

Projects are placed by **visible index** `i` (after filtering), so filtering never breaks the rhythm.

| Range | Pattern |
|---|---|
| ≥ 1024 | Cards are grouped in pairs (0,1), (2,3), … · Pair *k* even: **7 cols** + **5 cols**, the 5-col card offset **+96 px** · Pair *k* odd: **5 cols** offset **+64 px** + **7 cols** · An unpaired final card spans 7 · Row gap 96 px |
| 768–1023 | 2-up (4 + 4 cols); every second card offset **+48 px** · Row gap 64 px |
| < 768 | 1-up, no offsets · Row gap 48 px |

**Frame ratios:** 7-col cards **16:10**; 5-col cards **4:3**; tablet **4:3**; mobile **16:10**. Image fit follows DS-08 (see the Project card in the component spec).

## 5. Spacing scale

4 px base. Tokens are `--space-<n>`.

| Token | px | rem | Typical use |
|---|---|---|---|
| `space-1` | 4 | 0.25 | Icon/text nudges |
| `space-2` | 8 | 0.5 | Chip gaps, tag padding |
| `space-3` | 12 | 0.75 | Meta line gaps |
| `space-4` | 16 | 1 | Mobile gutter, input padding |
| `space-5` | 24 | 1.5 | Card text spacing, tablet gutter |
| `space-6` | 32 | 2 | Desktop gutter, block gaps |
| `space-7` | 48 | 3 | Heading-to-content, mobile row gap |
| `space-8` | 64 | 4 | Mobile section padding, desktop margin |
| `space-9` | 96 | 6 | Desktop project row gap, offsets |
| `space-10` | 128 | 8 | Desktop section padding |

**Section vertical padding:** `--space-section: clamp(4rem, 2.667rem + 5.926vw, 8rem)` (64 → 128 px).

## 6. Shape, borders and elevation (DS-17)

| Token | Value | Used by |
|---|---|---|
| `radius-none` | 0 | Image frames, cards, sections, bands |
| `radius-sm` | 2 px | Inputs, textarea, status panels |
| `radius-pill` | 9999 px | Buttons, chips, tags, theme toggle, back-to-top |
| `border-hairline` | 1 px solid `rule` | Section and row dividers (decorative) |
| `border-ui` | 1 px solid `border` | Inputs, outline buttons, tags, toggle |
| `border-ui-strong` | 2 px solid `text` / `error` | Focused input outline, invalid input |
| Elevation | **None** | No shadows; separation through rules and whitespace |

## 7. Motion (DS-12, DS-14, DS-16)

| Token | Value |
|---|---|
| `duration-fast` | 150 ms |
| `duration-base` | 200 ms |
| `duration-slow` | 400 ms |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` |

**The complete list of permitted motion:**

| Motion | Spec | Reduced motion |
|---|---|---|
| Button and chip colour change | `background-color`, `color`, `border-color` · fast · standard | Instant |
| Link underline thickness | 1 → 2 px (no transition) | Same |
| Project image hover/focus zoom | `transform: scale(1.02)` · slow · ease-out; linked cards only | None |
| Mobile menu open/close | Opacity 0 → 1 · base | Instant |
| Back-to-top appear | Opacity · fast | Instant |
| Smooth anchor scrolling | `scroll-behavior: smooth` | `auto` |
| Skills strip | Linear translate, one loop ≈ 60 s; pausable | **Static** (no movement) |

Nothing else animates: no entrance or scroll reveals, parallax, page transitions, preloader, cursor effects or theme cross-fade.

## 8. Focus and interaction states

| Rule | Spec |
|---|---|
| Focus indicator | `outline: 2px solid var(--color-focus); outline-offset: 3px`, on `:focus-visible` only; never removed |
| Focus on the yellow band | `--color-focus` is set to ink in both themes |
| Not obscured | `scroll-padding-top: calc(var(--header-h) + 16px)` (WCAG 2.4.11) |
| Hover | Never the only way to reveal information (NFR-RSP-04) |
| Pressed / current | `aria-pressed` for filter chips; `aria-current="true"` for the active nav item (2 px underline) |
| Disabled | Used only for "Sending…": the label changes and `aria-disabled="true"` is set; colours stay at full strength, so contrast is unchanged (no opacity fades) |
| Target size | ≥ 44×44 px for every control; inline text links follow the WCAG 2.5.8 inline exception |

## 9. Iconography

| Rule | Spec |
|---|---|
| Style | Line icons, 24 px grid, 1.6 px stroke, round caps and joins |
| Delivery | Inline SVG components in the repo (no icon-font or runtime dependency); source chosen in Phase 05 (hand-drawn or a permissively licensed set copied in) |
| Sizes | 16 / 20 / 24 px |
| Accessibility | Decorative icons `aria-hidden="true"`; icon-only buttons and links carry an accessible name |
| Set | sun, moon, menu, close, arrow-right, arrow-up-right (external), arrow-up, download, chevron-down, linkedin, github, mail, phone, pause, play, alert-circle, check-circle; service icons: monitor, pen-ruler, accessibility, flask |

## 10. Imagery

| Image | Frame | Fit | Treatment |
|---|---|---|---|
| Portrait | 4:5, `radius-none`, 1 px `rule` border | `cover`, `object-position: 50% 20%` | None (no filters) |
| Project image, ratio ≥ 1.4 | Per §4 | `cover`, top-aligned | Hover zoom only if linked |
| Project image, ratio < 1.4 | Per §4 | `contain` on `surface-2`, 24 px padding | — |
| Blurred enterprise images | Same as above | Same | Shown as provided (already blurred) |
| Testimonial photo | 56 px circle | `cover` | — |
| OG image | 1200×630 | Composition from portrait, name and title (Phase 06) | — |

## 11. Theming

| Aspect | Spec |
|---|---|
| Mechanism | CSS custom properties per theme on `:root[data-theme="light"\|"dark"]`; the first paint uses `prefers-color-scheme` via an inline pre-paint script (FR-THM-02, ≤ 1 KB) |
| Default | System preference |
| Toggle | Header button (sun/moon); the choice is stored in `localStorage` |
| Images | Unchanged across themes |
| `color-scheme` | Set to match the theme, so native controls and scrollbars adapt |

## 12. Layering

| Token | z-index | Element |
|---|---|---|
| `z-header` | 40 | Sticky header |
| `z-back-to-top` | 45 | Back-to-top button |
| `z-menu` | 50 | Mobile menu overlay |
| `z-skip` | 60 | Skip link (on focus) |

## 13. Accessibility checklist (design level)

- [x] All colour pairings verified ([COLOR_TOKENS.md §4](COLOR_TOKENS.md#4-verified-pairings))
- [x] Focus style defined for every theme and surface, including the yellow band
- [x] No information conveyed by colour alone (tags use a glyph and text; errors use an icon and text)
- [x] Reduced-motion behaviour specified for every permitted motion
- [x] Targets ≥ 44 px; layouts reflow at 320 px; type is `rem`-based
- [x] One `h1` per page; numbered `h2` sections; heading order defined ([TYPOGRAPHY.md §4](TYPOGRAPHY.md#4-hierarchy-per-section))
