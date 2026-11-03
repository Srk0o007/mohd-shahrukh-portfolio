# ADR 0004: Tailwind CSS v4 with design tokens

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

The target stack names Tailwind CSS. Phase 04 defined colour, type, spacing, motion and radius tokens, light and dark themes, and strict contrast rules.

## Decision

**Setup:**
- Tailwind CSS **4.3**, CSS-first, via `@tailwindcss/postcss`.
- No `tailwind.config.js`.

**In `src/app/globals.css`:**
1. `@import "tailwindcss";`
2. Per-theme raw variables on `:root[data-theme="light"]` and `:root[data-theme="dark"]` (values from [COLOR_TOKENS.md](../../design/COLOR_TOKENS.md)).
3. `@theme inline { … }` maps them to Tailwind tokens (`--color-bg`, `--color-text-muted`, …), along with the font, type-scale (`--text-*` with line-height and tracking), spacing, radius and motion tokens.
4. `--color-*: initial;` removes the default palette, so only design tokens exist.
5. `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`

**Other rules:**
- The base layer sets `:focus-visible`, `::selection`, `scroll-padding-top`, the reduced-motion overrides and the no-JS rules (`html:not([data-js]) …`).
- `prettier-plugin-tailwindcss` orders class names.

## Alternatives considered

| Option | Why not |
|---|---|
| CSS Modules / vanilla CSS | Valid, but the brief specifies Tailwind |
| UI kit (shadcn/ui, Radix, etc.) | Adds dependencies and a visual language to override; the component set is small |
| Tailwind v3 with a JS config | v4 is current; CSS-first tokens map directly onto the design docs |

## Consequences

- Design tokens have one source of truth in CSS.
- Accidental off-palette colours are impossible.
- Utility names follow the token names (e.g. `bg-surface-2`, `text-text-muted`).
