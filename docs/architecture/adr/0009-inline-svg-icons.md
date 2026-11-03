# ADR 0009: Inline SVG icons

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

The design needs about 21 line icons, including brand marks (LinkedIn, GitHub) ([DESIGN_SYSTEM.md §9](../../design/DESIGN_SYSTEM.md#9-iconography)). The live site used the Font Awesome web font (75 KB CSS plus fonts). Requirements: minimal dependencies (NFR-MNT-05) and accessible icons (NFR-A11Y-07).

## Decision

- Each icon is a small React component in `src/components/ui/icons/` that renders an inline `<svg>` (24 px grid, `stroke="currentColor"`, 1.6 stroke).
- Icons are `aria-hidden` by default; they take an accessible title only when they stand alone.
- **Sources:** paths are copied into the repo from permissively licensed sets:
  - UI icons: **Lucide** (ISC licence);
  - brand marks: **Simple Icons** (CC0).
- Attribution and licence text are recorded in `src/components/ui/icons/LICENSES.md`.
- Hand-drawn icons are allowed where no suitable path exists.

## Alternatives considered

| Option | Why not |
|---|---|
| `lucide-react` package | A runtime dependency for about 20 icons; tree-shaking works, but the copy approach is zero-dependency and lets us adjust stroke widths |
| Icon fonts (Font Awesome) | Extra CSS and font requests; accessibility pitfalls; rejected in the audit (P5) |
| SVG sprite file | An extra request and `<use>` cross-browser styling quirks; the icon count is small |

## Consequences

- No icon dependency and no extra requests.
- Licence compliance is maintained in-repo.
- Adding an icon means adding one file.
