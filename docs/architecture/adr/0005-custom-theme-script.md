# ADR 0005: Custom theme script

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

**FR-THM-01–04 require:**
- light and dark themes;
- the system preference as the default;
- a persisted user choice;
- **no flash of the wrong theme**;
- following live system changes until the user chooses.

The no-JS fallbacks also need a reliable "JS is running" signal (NFR-BRW-03).

## Decision

1. **`ThemeScript`:** a server-rendered inline `<script>` in `<head>`. It is a static string, under 1 KB (NFR-PERF-03), and runs before first paint:

   ```js
   (function () {
     var d = document.documentElement
     d.setAttribute('data-js', '')
     var t = null
     try { t = localStorage.getItem('theme') } catch (e) {}
     if (t !== 'light' && t !== 'dark') {
       t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
     }
     d.setAttribute('data-theme', t)
     d.style.colorScheme = t
   })()
   ```

2. **`ThemeToggle`** (client island) flips the attribute and writes `localStorage` (try/catch). While nothing is stored, it subscribes to `prefers-color-scheme` changes.
3. `<html suppressHydrationWarning>` tolerates the pre-hydration attributes.
4. **CSS fallback:** with JS disabled, `@media (prefers-color-scheme: dark)` applies the dark tokens to `:root:not([data-theme])`, so the system preference still works.

## Addendum (Phase 06, 2026-11-04)

The application theme lives on `<html>` and is controlled solely by this script and (from Phase 09) `ThemeToggle`. The temporary component preview at `/` may set scoped `data-theme` attributes on individual panels to render light and dark side by side; this does not change the production theme behaviour, and the preview is removed in Phase 07.

## Alternatives considered

| Option | Why not |
|---|---|
| `next-themes` | An extra runtime dependency for about 20 lines of logic; it injects its own script anyway |
| Cookie plus server rendering | Forces dynamic rendering ([ADR 0002](0002-static-prerendering-on-vercel.md)) |
| CSS-only (`prefers-color-scheme`) | Cannot persist a user choice (FR-THM-02) |

## Consequences

- No dependency is added; there is no flash.
- The inline script requires `script-src 'unsafe-inline'`. This is acceptable under [ADR 0008](0008-csp-for-static-pages.md) and is already needed by Next's own inline scripts on static pages.
