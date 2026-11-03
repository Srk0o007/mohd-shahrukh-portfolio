# Color Tokens

**Phase:** 04 — UI/UX Research & Design System
**Date:** 2026-11-03

All ratios are WCAG 2.x contrast ratios computed from sRGB relative luminance. Every pairing in §4 was recomputed by script during validation.

**Requirements served:** NFR-A11Y-04, FR-THM-01…03.

---

## 1. Rules

1. **Text** must be ≥ 4.5:1 on its background. Large text (≥ 24 px, or ≥ 18.66 px bold) must be ≥ 3:1. This design uses ≥ 4.5:1 for all text.
2. **UI boundaries** (input borders, the toggle outline, outline buttons, tag outlines) and **focus indicators** must be ≥ 3:1 against adjacent colours (1.4.11).
3. **Brand yellow `#F5DF4E`:**
   - **Light theme:** background only, with ink text. Never text, icons or borders on paper (1.21:1) or white (1.35:1).
   - **Dark theme:** may be used as text, icon, border, focus ring and button fill.
   - **The hire CTA band** is yellow in both themes, with ink content.
4. **Decorative rules** (`rule` token) carry no information and are exempt. Anything interactive or informative uses `border` or stronger.
5. **Colour is never the only signal.** Category tags pair fill with a glyph shape and text; errors pair colour with an icon and text.
6. **Themes** are selected by `data-theme="light|dark"` on `<html>`; the default follows `prefers-color-scheme` (FR-THM-01/02).

## 2. Primitive palette

| Primitive | Hex | Used by |
|---|---|---|
| `paper-100` | `#FFFFFF` | Light surface |
| `paper-200` | `#F5F2EA` | Light background |
| `paper-300` | `#ECE7DB` | Light surface-2 |
| `paper-400` | `#D9D3C4` | Light rule (decorative) |
| `stone-500` | `#807A6E` | Light border |
| `stone-600` | `#5C584F` | Light muted text |
| `ink-700` | `#34312B` | Light primary hover |
| `ink-900` | `#161513` | Light text / primary |
| `night-900` | `#121211` | Dark background |
| `night-800` | `#1C1B19` | Dark surface |
| `night-700` | `#24231F` | Dark surface-2 |
| `night-600` | `#2E2C28` | Dark rule (decorative) |
| `night-400` | `#7A766D` | Dark border |
| `night-300` | `#A8A398` | Dark muted text |
| `night-100` | `#EDEAE2` | Dark text |
| `yellow-400` | `#F5DF4E` | Brand accent |
| `yellow-300` | `#F7E77E` | Dark primary hover |
| `red-700` | `#A1281A` | Light error |
| `red-300` | `#FF8A75` | Dark error |
| `green-700` | `#1E6B3A` | Light success |
| `green-300` | `#7BCF96` | Dark success |

## 3. Semantic tokens

CSS custom properties, named `--color-<token>`. Tailwind mapping happens in Phase 05/06.

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `bg` | `#F5F2EA` | `#121211` | Page background |
| `surface` | `#FFFFFF` | `#1C1B19` | Inputs, image frames |
| `surface-2` | `#ECE7DB` | `#24231F` | Contained-image panels, status messages, secondary hover |
| `text` | `#161513` | `#EDEAE2` | Primary text and icons |
| `text-muted` | `#5C584F` | `#A8A398` | Secondary text: dates, captions, labels |
| `rule` | `#D9D3C4` | `#2E2C28` | Decorative hairlines between sections and rows |
| `border` | `#807A6E` | `#7A766D` | Interactive boundaries (inputs, outline buttons, tags, toggle) |
| `accent` | `#F5DF4E` | `#F5DF4E` | Highlight band, CTA band, selection; dark-theme accents |
| `on-accent` | `#161513` | `#121211` | Content on `accent` |
| `primary` | `#161513` | `#F5DF4E` | Primary button fill, pressed filter chip, enterprise tag (light) |
| `primary-hover` | `#34312B` | `#F7E77E` | Primary button hover |
| `on-primary` | `#F5F2EA` | `#121211` | Content on `primary` |
| `tag-enterprise-bg` | `#161513` | `#EDEAE2` | Filled enterprise tag |
| `tag-enterprise-fg` | `#F5F2EA` | `#121211` | Text on the enterprise tag |
| `focus` | `#161513` | `#F5DF4E` | Focus ring (on the yellow band: `#161513` in both themes) |
| `error` | `#A1281A` | `#FF8A75` | Field errors and the error status |
| `success` | `#1E6B3A` | `#7BCF96` | Success status |
| `selection-bg` | `#F5DF4E` | `#F5DF4E` | `::selection` background |
| `selection-fg` | `#161513` | `#121211` | `::selection` text |

## 4. Verified pairings

Format: `foreground` on `background` = ratio. The minimum is 4.5 for text and 3.0 for UI.

### 4.1 Light theme

| Pairing | Foreground | Background | Ratio | Min | Result |
|---|---|---|---|---|---|
| text / bg | `#161513` | `#F5F2EA` | 16.31 | 4.5 | ✅ |
| text / surface | `#161513` | `#FFFFFF` | 18.25 | 4.5 | ✅ |
| text / surface-2 | `#161513` | `#ECE7DB` | 14.79 | 4.5 | ✅ |
| text-muted / bg | `#5C584F` | `#F5F2EA` | 6.33 | 4.5 | ✅ |
| text-muted / surface | `#5C584F` | `#FFFFFF` | 7.09 | 4.5 | ✅ |
| text-muted / surface-2 | `#5C584F` | `#ECE7DB` | 5.74 | 4.5 | ✅ |
| border / bg | `#807A6E` | `#F5F2EA` | 3.81 | 3.0 | ✅ |
| border / surface | `#807A6E` | `#FFFFFF` | 4.26 | 3.0 | ✅ |
| border / surface-2 | `#807A6E` | `#ECE7DB` | 3.45 | 3.0 | ✅ |
| on-primary / primary | `#F5F2EA` | `#161513` | 16.31 | 4.5 | ✅ |
| on-primary / primary-hover | `#F5F2EA` | `#34312B` | 11.59 | 4.5 | ✅ |
| focus / bg | `#161513` | `#F5F2EA` | 16.31 | 3.0 | ✅ |
| on-accent / accent | `#161513` | `#F5DF4E` | 13.51 | 4.5 | ✅ |
| text-muted / accent | `#5C584F` | `#F5DF4E` | 5.25 | 4.5 | ✅ |
| tag-enterprise-fg / tag-enterprise-bg | `#F5F2EA` | `#161513` | 16.31 | 4.5 | ✅ |
| error / bg | `#A1281A` | `#F5F2EA` | 6.62 | 4.5 | ✅ |
| error / surface | `#A1281A` | `#FFFFFF` | 7.41 | 4.5 | ✅ |
| success / bg | `#1E6B3A` | `#F5F2EA` | 5.83 | 4.5 | ✅ |
| success / surface | `#1E6B3A` | `#FFFFFF` | 6.52 | 4.5 | ✅ |
| ❌ accent as text / bg (forbidden) | `#F5DF4E` | `#F5F2EA` | 1.21 | 4.5 | ❌ never use |

### 4.2 Dark theme

| Pairing | Foreground | Background | Ratio | Min | Result |
|---|---|---|---|---|---|
| text / bg | `#EDEAE2` | `#121211` | 15.59 | 4.5 | ✅ |
| text / surface | `#EDEAE2` | `#1C1B19` | 14.32 | 4.5 | ✅ |
| text / surface-2 | `#EDEAE2` | `#24231F` | 13.08 | 4.5 | ✅ |
| text-muted / bg | `#A8A398` | `#121211` | 7.46 | 4.5 | ✅ |
| text-muted / surface | `#A8A398` | `#1C1B19` | 6.85 | 4.5 | ✅ |
| text-muted / surface-2 | `#A8A398` | `#24231F` | 6.26 | 4.5 | ✅ |
| border / bg | `#7A766D` | `#121211` | 4.14 | 3.0 | ✅ |
| border / surface | `#7A766D` | `#1C1B19` | 3.80 | 3.0 | ✅ |
| border / surface-2 | `#7A766D` | `#24231F` | 3.47 | 3.0 | ✅ |
| on-primary / primary | `#121211` | `#F5DF4E` | 13.88 | 4.5 | ✅ |
| on-primary / primary-hover | `#121211` | `#F7E77E` | 14.89 | 4.5 | ✅ |
| focus / bg | `#F5DF4E` | `#121211` | 13.88 | 3.0 | ✅ |
| focus / surface | `#F5DF4E` | `#1C1B19` | 12.74 | 3.0 | ✅ |
| accent as text / bg | `#F5DF4E` | `#121211` | 13.88 | 4.5 | ✅ |
| on-accent / accent | `#121211` | `#F5DF4E` | 13.88 | 4.5 | ✅ |
| tag-enterprise-fg / tag-enterprise-bg | `#121211` | `#EDEAE2` | 15.59 | 4.5 | ✅ |
| error / bg | `#FF8A75` | `#121211` | 8.16 | 4.5 | ✅ |
| error / surface | `#FF8A75` | `#1C1B19` | 7.49 | 4.5 | ✅ |
| success / bg | `#7BCF96` | `#121211` | 10.00 | 4.5 | ✅ |
| success / surface | `#7BCF96` | `#1C1B19` | 9.19 | 4.5 | ✅ |

### 4.3 Hire CTA band (both themes)

| Pairing | Foreground | Background | Ratio | Min | Result |
|---|---|---|---|---|---|
| band text / band | `#161513` | `#F5DF4E` | 13.51 | 4.5 | ✅ |
| band button text / band button (ink fill) | `#F5F2EA` | `#161513` | 16.31 | 4.5 | ✅ |
| band focus ring / band | `#161513` | `#F5DF4E` | 13.51 | 3.0 | ✅ |

## 5. Usage map

| Element | Token(s) |
|---|---|
| Page | `bg`, `text` |
| Section eyebrow index ("01 — About"), dates, captions | `text-muted` |
| Section dividers, row separators | `rule` |
| Highlighted hero title | `accent` background + `on-accent` text |
| Primary button | `primary` / `on-primary`; hover `primary-hover` |
| Secondary (outline) button | `border` outline, `text`; hover background `surface-2` |
| Filter chip: default / pressed | `border` + `text` / `primary` + `on-primary` |
| Enterprise tag / website tag | `tag-enterprise-bg` + `-fg` / `border` outline + `text` |
| Inputs | `surface` fill, `border` boundary, `text`; error `error` (2 px) |
| Status messages | `surface-2` panel + `success`/`error` icon and lead text |
| Contained project image panel | `surface-2` |
| Focus | `focus` (2 px ring, 3 px offset) |
| Text selection | `selection-bg` / `selection-fg` |

## 6. Forced colours

In `forced-colors: active`, tokens are overridden by system colours. Focus rings use `outline` (not `box-shadow`), and tags and buttons keep a 1 px border so their boundaries survive (NFR-BRW-04).
