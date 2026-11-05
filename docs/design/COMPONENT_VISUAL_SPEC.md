# Component Visual Specification

**Phase:** 04 — UI/UX Research & Design System
**Date:** 2026-11-03

Tokens refer to [COLOR_TOKENS.md](COLOR_TOKENS.md) (colours), [TYPOGRAPHY.md](TYPOGRAPHY.md) (type) and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) (spacing, grid, motion, focus). Requirement IDs refer to [FUNCTIONAL_REQUIREMENTS.md](../requirements/FUNCTIONAL_REQUIREMENTS.md). Copy comes only from [CONTENT_SCHEMA.md](../requirements/CONTENT_SCHEMA.md).

**Universal states:**
- **Focus** = 2 px `focus` outline, 3 px offset (on `:focus-visible`).
- **Hover** never carries information.
- **Reduced motion** removes every transition listed in [DESIGN_SYSTEM.md §7](DESIGN_SYSTEM.md#7-motion-ds-12-ds-14-ds-16).

> **Phase 11.5 update (2026-11-05):** the visual source of truth is now the frozen prototype (`.handoff/`, git-ignored).
> - **Header:** a glass header.
> - **Hero:** a morphing portrait with orbits.
> - **Section headers:** an eyebrow and an outlined number.
> - **Skills:** editor tabs, a code view and a ticker.
> - **Education:** a journey timeline with 3 entries.
> - **Projects:** a uniform 2-column grid.
> - **Testimonials:** a slider.
> - **Footer:** copyright and credit only.
>
> Section numbers below still map to the components; their measurements are historical where they differ from the prototype.

## Index

| # | Component | Requirements |
|---|---|---|
| 1 | Skip link | FR-NAV-03 |
| 2 | Header | FR-NAV-01, FR-NAV-04 |
| 3 | Nav link | FR-NAV-01, FR-NAV-04 |
| 4 | Mobile menu overlay | FR-NAV-02 |
| 5 | Theme toggle | FR-THM-02 |
| 6 | Buttons and text links | FR-HERO-01, FR-CTA-01, FR-RES-06 |
| 7 | Section header (numbered) | DS-02, NFR-A11Y-03 |
| 8 | Hero | FR-HERO-01/02 |
| 9 | Skills strip | FR-INT-06, DS-12 |
| 10 | About and key facts | FR-ABT-01, DS-20 |
| 11 | Service item | FR-SRV-01 |
| 12 | Experience entry | FR-RES-01/02 |
| 13 | Skill group | FR-RES-03 |
| 14 | Credential row (certification and education) | FR-RES-04/05 |
| 15 | Project filter | FR-PRJ-02 |
| 16 | Category tag | DS-09 |
| 17 | Project card | FR-PRJ-01, 03–07 |
| 18 | Hire CTA band | FR-CTA-01 |
| 19 | Testimonial | FR-TST-01 |
| 20 | Contact details | FR-CON-01, FR-SOC-01 |
| 21 | Form field | FR-CON-02/03/07 |
| 22 | Form submit and status | FR-CON-04 |
| 23 | Footer | FR-FTR-01 |
| 24 | Back to top | FR-INT-05 |
| 25 | 404 page | FR-ERR-01 |

---

## 1. Skip link

| Property | Spec |
|---|---|
| Position | Fixed top-left (16 px inset), `z-skip`; visually hidden until focused |
| Look | Pill, `primary` / `on-primary`, `ui` 600, 44 px tall, 20 px horizontal padding |
| Text | `UiCopy.skipLink` "Skip to main content" → focuses `<main>` |

## 2. Header

| Property | Spec |
|---|---|
| Structure | Wordmark (left) · inline nav (≥ 1280) · theme toggle · Download CV (primary, md) · Menu button (< 1280). The theme toggle was added in Phase 09 (no placeholder before then, owner condition B). |
| Height | 72 px (≥ 768), 64 px (< 768); `--header-h` drives the content `scroll-margin-top` (DS-19) |
| Surface | Solid `bg`, 1 px `rule` bottom border; sticky top, `z-header` |
| Wordmark | `wordmark` token, "Mohd Shahrukh", links to `/#top`; no underline |
| Link targets | Header, menu and footer links use `/#section`, so they also work from the 404 page (owner condition A) |
| Spacing | Item gap 24 px from 768 px, 12 px below (so wordmark + two 44 px controls fit at 320 px); nav links 28 px; outer margins follow the grid |
| Mobile (< 768) | Wordmark · theme toggle · Menu button. Download CV moves into the menu, so the header fits at 320 px. |
| Tablet (768–1279) | Wordmark · theme toggle · Download CV · Menu button |
| No JavaScript | The inline nav (wrapped) and Download CV stay visible at every width; the menu button and theme toggle are hidden |

## 3. Nav link

| State | Spec |
|---|---|
| Default | `ui` 500, `text`, no underline |
| Hover | 1 px underline, offset 6 px |
| Current (`aria-current="true"`) | 2 px underline, `text`. Set by the active-section observer on the section being read (reading line 40% down the viewport); in the menu only the label is underlined, not its number |
| Focus | Universal ring |

## 4. Mobile menu overlay

| Property | Spec |
|---|---|
| Trigger | 44 px outline circle with the Lucide `menu` icon; accessible name "Open menu" (approved UI copy, no new visible text); `aria-expanded`; `aria-controls` only while open (so it never points at a missing element) |
| Surface | Full viewport, `bg`, `z-menu`; header row: wordmark + 44 px close button (Lucide `x`, accessible name "Close menu"). A modal dialog: `role="dialog"`, `aria-modal="true"`, named by the wordmark (Phase 10) |
| Items | Numbered list, each 56 px min height: index in `label` `text-muted` + label in Fraunces 500 at 36 px (`h2` min); `rule` separators |
| Order | 01 About … 07 Contact (nav order, D15). The menu's own 01–07 numbering may differ from section indices; screen readers announce only the labels (numbers `aria-hidden`). |
| Footer of menu | Download CV (primary, lg, full width) · **text links: GitHub, LinkedIn, Email** (owner decision, 2026-11-04) · theme toggle (right-aligned, Phase 09) |
| Behaviour | Focus moves to the first item; Tab and Shift+Tab are contained; the rest of the page is `inert`; page scroll locked; Esc or Close closes it and returns focus to the toggle; selecting a link closes it and **moves focus to the target section**; on the 404 page links navigate to the home-page section |
| Motion | Opacity fade (base); instant under reduced motion |

## 5. Theme toggle

| Property | Spec |
|---|---|
| Size | 44×44 px circle, 1 px `border`, transparent fill |
| Icon | Moon in the light theme ("Switch to dark theme"), sun in the dark theme ("Switch to light theme"), 20 px |
| Hover | `surface-2` fill |
| No-JS | Hidden (the system preference still applies via CSS) |

## 6. Buttons and text links

| Variant | Look | Sizes | Hover | Notes |
|---|---|---|---|---|
| **Primary** | Pill, `primary` fill, `on-primary` text, `ui` 600 | md 44 px / lg 52 px; padding 20 / 28 px | `primary-hover` | "View My Work", "Download CV", "Send", "Call Me!" (on the band: ink fill) |
| **Secondary** | Pill, 1 px `border` (`text` on the band), transparent | md / lg | `surface-2` fill (on the band: none; the underline thickens) | "Menu", "Hire Me!" |
| **Text link + arrow** | `ui` 600, 1 px underline, trailing → | Inline; 44 px tap area via padding | 2 px underline | "Contact Me →", "Visit … website ↗" |
| **Disclosure** | Text link + chevron-down (rotates 180° when expanded; instant under reduced motion) | — | 2 px underline | "Show all 11 highlights" |

**Icons in buttons:** 16 px, 8 px gap. **External links:** ↗ glyph plus visually hidden "(opens in new tab)".

**Forced colours (Phase 10, NFR-BRW-04):** filled variants (primary, ink, pressed chip, skip link, enterprise tag) carry a transparent 1 px border. It is invisible normally, but forced-colours mode paints it, so the outline survives when fills are removed. The pressed filter chip uses `Highlight` / `HighlightText` there.

**Social text links** (About, Contact, footer, menu): 44 px minimum height (WCAG 2.5.8; they form a list, not inline text).

## 7. Section header (numbered)

| Property | Spec |
|---|---|
| Anatomy | Index label ("03 — Experience", `label`, `text-muted`) · `h2` heading · optional intro (`lead`) |
| ≥ 1024 | Label in cols 1–3 (top-aligned with the heading's cap height); heading and intro in cols 4–12 |
| < 1024 | Stacked: label, 16 px, heading, 24 px, intro |
| Section top | 1 px `rule` divider at full container width; padding `--space-section` |
| Semantics | `<section aria-labelledby>`; the index label is a `<p>` (not part of the heading) |

## 8. Hero

| Property | Spec |
|---|---|
| Anatomy | Eyebrow "Portfolio" (`label`) · `h1` "Mohd" / "Shahrukh" (`display`) · highlighted title (`title-line`, `accent` background, `on-accent`, 2 px × 10 px padding, `box-decoration-break: clone`) · location (`lead`, `text-muted`) · CTAs: primary lg "View My Work" + text link "Contact Me →" · portrait |
| ≥ 1024 | Text cols 1–8, bottom-aligned with the portrait (cols 9–12, 4:5); portrait caption: "6+ Years of Experience" left, "Bangalore, IN" right (`small`, `text-muted`) |
| 768–1023 | Text cols 1–5, portrait cols 6–8 |
| < 768 | Stacked: eyebrow, h1, title, location, CTAs, then the portrait (full width up to 360 px) |
| Spacing | Top padding 80 px (desktop) / 40 px (mobile); h1 → title 36 / 24 px; CTAs 40 / 28 px above |
| Motion | None |

## 9. Skills strip (DS-12)

**Not built.** Owner decision, 2026-11-04 (Phase 09): the design stays static, with no extra motion or JavaScript. The specification below is kept for reference only.

| Property | Spec |
|---|---|
| Placement | Directly after the hero, full container width, 1 px `rule` above and below, height 72 px (64 px on mobile) |
| Content | Skill names from the first three `SkillGroup`s, separated by "·" in `text-muted`; text in Fraunces 500 at 28 px (22 px on mobile) |
| Behaviour | Duplicated track, linear translate, one loop ≈ 60 s; starts moving only when ≥ 50% visible |
| Control | Pause/play button at the right end (44×44, outline circle, icon, `aria-label` "Pause skills animation" / "Play skills animation"); state persists for the visit |
| Semantics | The moving text is `aria-hidden="true"` (it repeats the Skills section); the button stays accessible |
| Reduced motion | Static single row (overflow clipped with a fade); no pause button |

## 10. About and key facts (DS-20)

| Property | Spec |
|---|---|
| Layout | Section header (01) · summary (`lead`, max 62ch) in cols 4–10 · key facts below |
| Key facts | `<dl>` row of 3: **Role**, **Based in**, **Experience** (values from `Profile.title`, `Profile.location`, `Profile.yearsOfExperience` + "Years"); `dt` in `label` `text-muted`, `dd` in `body` 500; separated by 1 px `rule` dividers; 3-up ≥ 768, stacked < 768 |
| Links | GitHub and LinkedIn as **text links** with the external-link arrow and "(opens in new tab)" announcement (owner decision, 2026-11-04) |

## 11. Service item

| Property | Spec |
|---|---|
| Grid | 2×2 at ≥ 768 (cols 4–12 split in two on ≥ 1024); 1-up below |
| Anatomy | 1 px `rule` top · icon 24 px (`text`, decorative) · `h3` title · `body` description in `text-muted`, max 48ch |
| Spacing | 24 px top padding; icon → title 16 px; title → body 12 px; row gap 48 px |

## 12. Experience entry

| Property | Spec |
|---|---|
| Row | 1 px `rule` top; 32 px vertical padding |
| ≥ 1024 | Cols 1–3: dates (`ui` 500, tabular, `<time>`), location below (`small`, muted) · Cols 4–12: company `h3-lg` + note "(formerly PropShare)" in `text-muted` · role (`body`, muted) · tagline (`small`, muted) · highlights |
| < 1024 | Stacked: dates line ("May 2024 – Oct 2026 · Bangalore") above the company |
| Highlights | `<ul>`, `body`, 10 px gap, max 72ch, marker "—" in `text-muted` |
| Disclosure (DS-13) | When there are more than 4 highlights, show 4 plus a disclosure button "Show all {n} highlights" / "Show fewer highlights" (`aria-expanded`, `aria-controls`). Without JS, all are shown and there is no button. Focus stays on the button. |

## 13. Skill group

| Property | Spec |
|---|---|
| Grid | 3-up at ≥ 1024, 2-up at 768–1023, 1-up below; 1 px `rule` top per group; gap 32 × 48 px |
| Anatomy | Group label (`label`, `text-muted`) · skills as an inline list in `body`, items separated by " · " (separators `aria-hidden`; the list is semantic `<ul>` with inline items) · optional context (`small`, muted), e.g. Testing: "unit, component, UI/API integration and end-to-end testing" |

## 14. Credential row (certification and education)

| Property | Spec |
|---|---|
| ≥ 768 | Two-column row: name (`h3`, cols 4–9) · issuer and credential type (`small`, muted, cols 10–12, right-aligned) |
| < 768 | Stacked |
| Separators | 1 px `rule` between rows |
| Education | Degree (`h3`) · institution (`body`) · "Graduated 2019" (`small`, muted, tabular) |

## 15. Project filter

| Property | Spec |
|---|---|
| Position | Right of the section heading on ≥ 1024 (bottom-aligned); below the heading on smaller screens |
| Chips | Pill buttons 44 px tall, 18 px padding, `ui` 500: "All", "Enterprise products", "Websites" (D10) |
| States | Default: 1 px `border`, `text` · Pressed (`aria-pressed="true"`): `primary` fill, `on-primary` · Hover: `surface-2` fill · Focus: ring |
| Status | Visually hidden `aria-live="polite"` text: "Showing {n} of {total} projects" |
| No-JS | Chips hidden; all cards visible |
| Overflow | Chips wrap onto a second line on narrow screens (no horizontal scrolling) |

## 16. Category tag (DS-09)

| Variant | Look |
|---|---|
| **Enterprise product** | Pill, `tag-enterprise-bg` fill, `tag-enterprise-fg` text, glyph ■ (filled square, 8 px), `label` |
| **Website** | Pill, 1 px `border` outline, `text`, glyph □ (outlined square, 8 px), `label` |

Glyphs are `aria-hidden`; the visible text carries the meaning. Height 24 px; padding 4 × 10 px. Tags are not interactive.

## 17. Project card

**Anatomy, top to bottom:**
1. Image frame
2. Meta row: index "07" (`label`, tabular, muted) · category tag
3. Title (`h3`)
4. Subtitle (`body`, muted)
5. Optional verified fields (`small`, muted): date · stack
6. Link **or** note

| Property | Spec |
|---|---|
| Frame | Per [DESIGN_SYSTEM.md §4](DESIGN_SYSTEM.md#4-asymmetric-project-rhythm-ds-07): 16:10 or 4:3; 1 px `rule` border; `surface` fill |
| Image fit (DS-08) | Intrinsic ratio ≥ 1.4 → `cover`, `object-position: top center` · ratio < 1.4 → `contain` on `surface-2` with 24 px padding (Virtual University, QuickCashTx, Niles Academy) |
| Spacing | Frame → meta 20 px; meta → title 8 px; title → subtitle 6 px; → link/note 16 px |
| Link (only `linkStatus = "live"`) | Text link: "Visit {title} website ↗" plus the hidden "(opens in new tab)"; the card is **not** a full-card link. On link hover/focus, the image zooms 1.02 (DS-14). |
| Note (`linkStatus = "none"`) | "Internal product — no public link" (`small`, muted) |
| Pending (`linkStatus = "pending"`) | No link, no note |
| Enterprise distinction | Filled tag (§16). The blurred image is shown as provided. |
| Semantics | `<article>` with an `h3`; the image `alt` comes from content |
| Loading | Lazy below the fold; explicit `width`/`height`; no layout shift |

## 18. Hire CTA band (DS-10)

| Property | Spec |
|---|---|
| Surface | Full-bleed `accent` (`#F5DF4E`) in both themes; ink content; `--color-focus` set to ink |
| Content | Heading "Interested in working with me?" (`h2`) · "Call Me!" (primary lg, ink fill, `tel:` link, D19) · "Hire Me!" (secondary lg, ink outline → `#contact`) |
| Layout | ≥ 1024: heading cols 1–8, buttons right-aligned cols 9–12 · < 1024: stacked, buttons in a wrapping row |
| Padding | `--space-section` × 0.75 |
| Motion | None (no parallax) |

## 19. Testimonial

| Property | Spec |
|---|---|
| Layout | 2-up at ≥ 1024 (cols 1–6 / 7–12); stacked below; static (no carousel) |
| Anatomy | Decorative “ (Fraunces 64 px, `text-muted`, `aria-hidden`) · `<blockquote>` in `quote` · `<figcaption>`: photo 56 px circle + name (`ui` 600) + role (`small`, muted) |
| Separators | 1 px `rule` top on each |

## 20. Contact details

| Property | Spec |
|---|---|
| Layout | Cols 1–5 (≥ 1024); stacked above the form below that |
| Heading | Index "09 — Contact" · "Let's get in touch" (`display-2`) · intro (`lead`) |
| Details | `<dl>`: Based in · Phone (`tel:` link) · Email (`mailto:` link); `dt` `label` muted, `dd` `body` 500 |
| Social | **Text links** GitHub, LinkedIn, Email (owner decision, 2026-11-04; no brand logos because no permissively licensed LinkedIn mark exists). External links announce "(opens in new tab)". |

## 21. Form field

| Property | Spec |
|---|---|
| Label | Above the field, `ui` 500, `text`; "(required)" appended in `text-muted` |
| Input | Height 52 px; padding 0 16 px; `surface` fill; 1 px `border`; `radius-sm`; `body` text |
| Textarea | Min height 160 px; vertical resize only |
| Focus | 2 px `text` border **plus** the universal focus ring |
| Invalid | 2 px `error` border · message below: alert-circle icon (16 px) + `small` text in `error`, linked via `aria-describedby` |
| Help / counter (DS-15) | Below the textarea, right-aligned, `small` tabular muted: "{n} / 5000"; not live-announced |
| Spacing | Label → input 8 px; field gap 24 px |
| Honeypot | Visually and programmatically hidden (FR-CON-05); not part of the visual spec |

## 22. Form submit and status

| State | Spec |
|---|---|
| Idle | Primary lg "Send" with an arrow-right icon |
| Sending | Label "Sending…", `aria-disabled="true"`, colours unchanged (no opacity fade); no spinner animation |
| Success | Panel below the button: `surface-2`, `radius-sm`, 16 px padding, check-circle icon in `success` + `UiCopy.sendSuccess` in `body`; `role="status"` |
| Error | Same panel with alert-circle in `error` + `UiCopy.sendError`, with the email as a link; `role="alert"` |

## 23. Footer

| Property | Spec |
|---|---|
| Layout | 1 px `rule` top; copyright · "Designed by Mohd Shahrukh" · social **text links** (GitHub, LinkedIn, Email); stacked < 768 |
| Type | `small`, `text-muted` |
| Spacing | 48 px top padding; 40 px bottom below 768 px, 96 px from 768 px, so the right-aligned links stay clear of the fixed back-to-top button at the end of the page (Phase 10) |

## 24. Back to top

| Property | Spec |
|---|---|
| Look | 48×48 circle, `surface` fill, 1 px `border`, arrow-up 20 px; `aria-label` "Back to top" |
| Position | Fixed bottom-right (24 px inset; 16 px on mobile), `z-back-to-top` |
| Visibility | Appears after the hero leaves the viewport (fade, fast); it is an anchor to `#top` |

## 25. 404 page

| Property | Spec |
|---|---|
| Layout | Header and footer as usual; content in the reading column |
| Content | "404" (`display-2`, `text-muted`, `aria-hidden`) · `h1` `UiCopy.notFoundHeading` (`h2` size) · `UiCopy.notFoundText` (`lead`) · primary lg `UiCopy.notFoundLink` → `/` |

---

## Responsive summary

| Component | < 768 | 768–1023 | 1024–1279 | ≥ 1280 |
|---|---|---|---|---|
| Header nav | Menu button | Menu button | Menu button | Inline links |
| Hero | Stacked, portrait last | Text 5 + portrait 3 | Text 8 + portrait 4 | Same |
| Section header | Stacked | Stacked | Split 3/9 | Split 3/9 |
| Services | 1-up | 2×2 | 2×2 in cols 4–12 | Same |
| Experience | Stacked | Stacked | Dates 3 + content 9 | Same |
| Skills | 1-up | 2-up | 3-up | 3-up |
| Projects | 1-up | 2-up staggered | Asymmetric 7/5 · 5/7 | Same |
| Testimonials | Stacked | Stacked | 2-up | 2-up |
| Contact | Stacked | Stacked | Details 5 + form 7 | Same |
