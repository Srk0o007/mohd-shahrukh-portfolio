# ADR 0014: Dark-only theme and the Andika typeface

- **Status:** Accepted (owner decision, 2026-11-05)
- **Date:** 2026-11-05
- **Supersedes:** FR-THM-01–04 (light/dark themes and the toggle)
- **Amends:** [ADR 0005](0005-custom-theme-script.md) (the pre-paint script now only sets `data-js`), [ADR 0004](0004-tailwind-v4-design-tokens.md) (one palette)

## Context

The owner froze a new design on 2026-11-05 (Phase 11.5): dark only, a cyan accent, the Andika typeface, and a particle wave behind a black content column. The two-theme system, toggle and storage no longer have a purpose.

## Decision

- **Palette:** one dark set in `globals.css` (`@theme`):
  - `bg #10100d`, `frame #000`, `card #050505`;
  - `heading #fff`, `sub #969696`;
  - `accent #00c2ff` / `#0077ff` / `#7fe3ff`, `on-accent #00131c`;
  - lines at 8 % / 16 % white;
  - `error` / `success` are kept from the old dark palette.
- **Colour scheme:** `color-scheme: dark`. No `dark:` variant and no `prefers-color-scheme` blocks.
- **Theme removal:** `ThemeToggle`, the theme storage and the Sun/Moon icons are deleted. `JsFlagScript` only sets `html[data-js]` for the no-JS fallbacks.
- **Font:** Andika 400/700 via `next/font/google`, self-hosted at build time, replaces Fraunces and Inter. Social images and icons use Andika and the new colours.

## Consequences

- **Less code:** the toggle island leaves first-load JS, and there is one palette to test (axe runs dark only).
- **Visitors with a light preference** get the dark site. That is an owner decision, recorded here.
- **Contrast:** text pairs are re-verified in ACCESSIBILITY_REPORT §4 (Phase 11.5 table). Two values were adjusted to pass AA:
  - the `faint` token is `#808080` (5.2:1 on cards) instead of the prototype's `#6b6b6b` / `#5a5a5a` (3.0–3.9:1). It is used for the skills meta line, code comments and tab ordinals;
  - form fields keep the 2 px focus outline.
