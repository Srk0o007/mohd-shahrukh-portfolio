# Design Direction

**Phase:** 04 — UI/UX Research & Design System
**Date:** 2026-11-03
**Status:** Selected by owner. Documents submitted for review (PR).

Related: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) · [COLOR_TOKENS.md](COLOR_TOKENS.md) · [TYPOGRAPHY.md](TYPOGRAPHY.md) · [COMPONENT_VISUAL_SPEC.md](COMPONENT_VISUAL_SPEC.md) · Requirements: [docs/requirements/](../requirements/) · Audit: [docs/audit/](../audit/)

---

## 1. Decision summary

The owner selected **Direction A — Editorial Grid** as the foundation (2026-11-03), with selected elements borrowed from C and B:

| Source | Element | How it is used |
|---|---|---|
| **A** (foundation) | Warm paper `#F5F2EA` and ink `#161513`; brand yellow `#F5DF4E` as the accent; Fraunces + Inter; asymmetric 12-column grid; large typography-led hero with portrait; editorial project cards with offset layouts; subtle hover; refined spacing; light and dark themes | The base visual language for every section |
| **C** (Quiet Technical) | Numbered section indicators | Every section carries an index label, "01 — About" … "09 — Contact" (DS-02) |
| **C** | Clear technical information hierarchy | Dated experience rows, grouped skills, a key-facts list, table-like rows for certifications and education (DS-20) |
| **B** (Signal Grid), selectively | Optional horizontal skills strip | One slow, pausable strip, static under reduced motion (DS-12) |
| **B**, selectively | Strong visual distinction between project categories | Filled tags for enterprise products and outlined tags for websites, each with a different glyph shape, not colour alone (DS-09) |
| **B**: explicitly **not** borrowed | Aggressive colour inversions, heavy expanded caps, dense ruled cells | Avoided, per owner instruction |

## 2. Content verification before design (owner request)

All checks were run on 2026-11-03. The method was read-only: live HTTP fetch and PDF text extraction.

### 2.1 Project count: 9 or 10?

| Check | Result |
|---|---|
| Live site re-fetched; compared with the Phase 02 snapshot | **Byte-identical**. HTTP `last-modified: Wed, 22 Jul 2026 18:47:39 GMT`; ETag unchanged |
| `div.portfolio-box` entries in the live HTML | **10** |
| Portfolio entries hidden inside HTML comments | **0** |
| Titles in DOM order | 1 Digital Asset Management · 2 Approval Software Management · 3 Campaign Management · 4 Job Listing Website · 5 SOSUDATECH Pvt. Ltd. · 6 Virtual University · 7 QuickCashTx · 8 Niles Academy · 9 Swiss Cosmetics · 10 Frontier Mining Solutions |
| Approved [CONTENT_INVENTORY.md §12](../audit/CONTENT_INVENTORY.md#12-portfolio-projects-portfolio) | 10 entries |
| Approved [CONTENT_SCHEMA.md §10](../requirements/CONTENT_SCHEMA.md#10-project) | 10 entries |
| Repository docs containing "nine" or "9 projects" | None |

**Conclusion: the verified count is 10.** The number nine does not appear in any approved document; it first appears in the Phase 02 instruction text ("all nine or otherwise verified project entries").

A likely source is the live site's filter tagging: **9 of the 10 entries** carry the "Front-End Development" class (`.mockups`) and only 1 carries "Web Design" (`.detailed`), so viewing that filter shows nine projects. No change to the approved content is needed.

### 2.2 Experience figure and employment dates

| Item | Resume (03 Nov 2026), extracted text | Approved schema | Match |
|---|---|---|---|
| Experience figure | "Frontend Engineer with **6+ years** of experience…" | `yearsOfExperience: "6+"` | ✅ |
| AltInvest Online Platform (formerly PropShare) | May 2024 – Oct 2026 | `2024-05` → `2026-10` | ✅ |
| BrandSystems India Pvt. Ltd. | Dec 2021 – Apr 2024 | `2021-12` → `2024-04` | ✅ |
| SOSUDATECH Pvt. Ltd. | Sep 2020 – Nov 2021 | `2020-09` → `2021-11` | ✅ |
| Education | B.Tech … Graduated 2019 | `graduated: 2019` | ✅ |

**Arithmetic check:**
- 15 + 29 + 30 = **74 months (6 years 2 months)**, with no gaps between roles: Nov 2021 → Dec 2021 and Apr 2024 → May 2024 are consecutive months.
- "6+" is therefore consistent with the dates.

The resume contains one "Present", and it belongs to the **mohdshahrukh.in project** (Mar 2023 – Present), not to any employment. That project is not displayed (D17), so the acceptance check "no 'Present' on the page" (AC-RES-1) still holds.

## 3. Directions explored

All three were mocked on a private design canvas owned by the site owner. Each had a desktop page with working theme toggle and filter, and a system sheet with a dark mobile mock, contrast-checked palettes, type, spacing and grid.

| | A — Editorial Grid | B — Signal Grid | C — Quiet Technical |
|---|---|---|---|
| Character | Editorial, print-inspired, whitespace | Bold modular, ruled cells | Calm, documentation-like |
| Palette | Paper/ink with a yellow highlighter | Off-white/black with yellow blocks | Slate with a cobalt accent |
| Type | Fraunces + Inter | Archivo (expanded) + JetBrains Mono | IBM Plex Sans + Plex Mono |
| Grid | Asymmetric 12-col | Ruled 12-col bento | Side rail + content |
| Projects | Offset editorial cards | Mixed-size tiles | List rows |
| Fit to brief (editorial grid, asymmetric projects, storytelling) | **High** | Medium | Low |
| Brand continuity (yellow) | High | Highest | Low |
| Readability of long content | High | Medium (caps) | High |
| Build effort | Medium | Medium | Low |

## 4. Design principles

1. **Editorial, not decorative.** Hierarchy comes from type scale, whitespace and alignment, not ornaments.
2. **Structure you can scan.** Numbered sections, dated rows and grouped lists (from C) make professional details fast to read.
3. **Restrained motion.** Motion only confirms interaction or signals the optional skills strip. No entrance choreography, parallax or page transitions.
4. **Accessible by construction.** Every colour pairing is pre-verified (COLOR_TOKENS); focus is always visible; targets are at least 44 px; reduced motion is honoured.
5. **Truthful content.** Layouts are built only from verified content. Optional fields (project descriptions, dates, stack) stay empty rather than invented.
6. **Lightweight.** Two self-hosted variable fonts, inline SVG icons, CSS-only effects, and no animation or UI libraries.

## 5. Design decisions (DS)

| ID | Decision | Rationale / requirement |
|---|---|---|
| DS-01 | Direction A is the foundation, with the borrowings in §1 | Owner selection |
| DS-02 | Sections are numbered in page order: 01 About · 02 Services · 03 Experience · 04 Skills · 05 Certifications · 06 Education · 07 Projects · 08 Testimonials · 09 Contact. Numbers appear in section eyebrows and the mobile menu; the desktop inline nav stays unnumbered. | Borrowed from C; PRD §7 order (the canvas mock used provisional numbers) |
| DS-03 | Inline desktop nav from **1280 px**; a menu button below 1280 px | Seven links plus the toggle and CV button need about 1000 px of width (FR-NAV-02) |
| DS-04 | Fraunces (roman, variable `opsz` + `wght`) and Inter (variable). **No italic files** | NFR-PERF-07 font budget (2 files) |
| DS-05 | Brand yellow is used only as a background (with ink text) or as text/lines on dark surfaces; **never as text on light surfaces** (1.35:1) | FR-THM-03 |
| DS-06 | Border tokens adjusted from the mock: light `#8A8478 → #807A6E`, dark `#6B675F → #7A766D` | Achieves ≥ 3:1 on all three surfaces (NFR-A11Y-04) |
| DS-07 | Project layout: alternating 7/5 and 5/7 column pairs with vertical offsets at ≥ 1024 px; 2-up with a stagger on tablet; 1-up on mobile | Editorial asymmetry; FR-PRJ-01 |
| DS-08 | Image fit rule: intrinsic ratio ≥ 1.4 → `cover`, top-aligned; < 1.4 (the three 375×393 captures) → `contain` on surface-2 with padding | FR-PRJ-06; R9 |
| DS-09 | Category distinction: **Enterprise product** = filled tag with ■ glyph; **Website** = outlined tag with □ glyph. Enterprise cards also show the D11 note. | Borrowed from B; NFR-A11Y-04 (not colour alone) |
| DS-10 | The hire CTA is a full-bleed yellow band with ink text in **both** themes; no parallax | Brand moment; FR-CTA-01 |
| DS-11 | Testimonials show 2-up, statically | FR-TST-01 |
| DS-12 | **Skills strip adopted (FR-INT-06).** One strip after the hero; content = skills from the first three skill groups; slow, linear (one loop ≈ 60 s); visible pause/play button; the moving text is `aria-hidden` (it repeats the Skills section); static under reduced motion | Borrowed from B (optional) |
| DS-13 | **Collapsible highlights adopted (FR-RES-02):** the first 4 highlights are shown, then "Show all {n} highlights". Without JS, all are visible. | Scannability of 11 AltInvest bullets |
| DS-14 | **Hover zoom adopted (FR-PRJ-07):** image scale 1.02 on hover and `:focus-visible` of linked cards only; none under reduced motion | Subtle hover (owner) |
| DS-15 | **Character counter adopted (FR-CON-07):** a passive "0 / 5000" below the message field; not announced on each keystroke | Usability |
| DS-16 | No scroll-entrance animations, parallax, page transitions, preloader or custom cursor | Owner: lightweight, purposeful motion; FR-INT-04 |
| DS-17 | Flat elevation: 1 px rules instead of shadows; square image frames; pill-shaped controls | Editorial character; performance |
| DS-18 | Portrait: right column (4:5) on desktop; beside the text on tablet; below the CTAs on mobile (max 360 px wide) | FR-HERO-02 |
| DS-19 | Sticky header with solid background (no blur), 72 px desktop / 64 px mobile; `scroll-padding-top` = header + 16 px | FR-NAV-01/05 |
| DS-20 | Technical hierarchy (from C): About shows a key-facts list built **only from existing schema fields** (Role, Based in, Experience); experience is a dated two-column row; skills are grouped lists; certifications and education are table-like rows | Owner borrowing; no new content |

## 6. Originality with respect to the reference

| Reference (designerankitsinha.web.app) | This design |
|---|---|
| Dark-first, near-black with rust accent | Light-first warm paper, ink and brand yellow; dark theme is ink, not pure black |
| Syne + Poppins | Fraunces + Inter |
| Stacked full-width project cards with a cursor label | Asymmetric offset grid of editorial cards with index numbers and category tags |
| Preloader, smooth-scroll hijack, magic cursor, page transitions | None (DS-16) |
| Accordion of capabilities | 2×2 services grid; collapsible experience highlights only |
| Opposing scrolling-text marquees | One optional, pausable skills strip |

Only general patterns are shared (fluid type, overlay menu, a single marquee), and they are re-implemented from scratch. No code, assets, copy or layout measurements are reused.

## 7. Differences from the canvas mock

| Item | Mock | Final spec |
|---|---|---|
| Section numbers | Provisional (e.g. "05 — Projects") | DS-02 order |
| Border tokens | `#8A8478` / `#6B675F` | `#807A6E` / `#7A766D` (DS-06) |
| Projects shown | 4 sample projects | All 10 (FR-PRJ-01) |
| Desktop nav breakpoint | 1024 px | 1280 px (DS-03) |
| Italic "(formerly PropShare)" | Fraunces italic | Muted roman (DS-04) |
| Key facts / skills strip / category tags | Not in A's mock | Added from C and B (DS-09, DS-12, DS-20) |

## 8. Open questions

See [PROJECT_STATUS.md](../../PROJECT_STATUS.md). None of them blocks Phase 05:

| # | Question | Default if unanswered |
|---|---|---|
| OQ-1 | Should the About key facts also include "Domains: Fintech · Proptech · Enterprise" and "Core stack: React.js · Next.js · TypeScript"? Both are derived from the [R] summary, but they would be a new schema field. | Not included (DS-20 uses existing fields only) |
| OQ-2 | Skills strip position: after the hero (proposed) or at the top of the Skills section | After the hero |
| OQ-3 | Should the canvas mock be updated to the final tokens and layout for reference? | Not updated; these documents are the source of truth |
