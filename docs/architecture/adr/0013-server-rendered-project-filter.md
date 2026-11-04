# ADR 0013: Server-rendered project cards with a CSS-driven filter

- **Status:** Accepted (owner decision, 2026-11-04)
- **Date:** 2026-11-04
- **Amends:** [COMPONENT_ARCHITECTURE.md §2–§3](../COMPONENT_ARCHITECTURE.md#3-client-islands-contracts), `ProjectGallery` contract

## Context

Phase 05 specified `ProjectGallery` as a client island that receives `ProjectView[]` and renders the filter chips and every card. The design has two requirements:
- **DS-07:** the asymmetric layout follows each card's *visible* index, so it changes with the filter.
- **NFR-PERF-05:** keep first-load JS low. It is already above the 120 KB target (R18; optimisation is scheduled for Phase 11).

Rendering the cards in a client component would ship the card, tag and image-markup code to the browser for content that never changes.

## Decision

**Cards:**
- Server components render all ten cards (`components/projects/ProjectCard.tsx`).

**Layout:**
- The server computes each card's layout for **every** filter state: `layoutsByFilter()` in `lib/project-layout.ts`.
- `layout-classes.ts` emits that layout as Tailwind classes keyed to the gallery's state, for example `lg:group-data-[filter=website]/gallery:col-span-7`. A card hidden in a state gets `group-data-[filter=…]/gallery:hidden`.

**Client island:**
- `ProjectGallery` is the only client component. Its sole state is the active filter, which it writes to `data-filter` on the `<ul class="group/gallery">`.
- It also renders the filter buttons (`aria-pressed`) and the polite status text.
- The cards reach it as server-rendered `children`.

**Filter chips:**
- The chips are server-rendered inside a `js-only` wrapper, so they reserve their space before hydration (no layout shift).
- Without JS they are hidden. `data-filter="all"` then shows all ten cards in the "All" layout.

**Image `sizes`:**
- Each card's `sizes` comes from its "All" layout (7 or 5 columns), because that is the default view.

## Alternatives considered

| Option | Why not |
|---|---|
| Client `ProjectGallery` renders the cards (Phase 05 plan) | Ships card rendering code for static content; about 3–4 KB more first-load JS by estimate |
| Island sets layout attributes on the DOM imperatively | Bypasses React; harder to test; same result as CSS state classes |
| Inline custom properties per card | Works, but relies on `style` attributes (CSP `style-src` hardening in Phase 11) |

## Consequences

**Benefits:**
- First-load JS grew by **0.4 KB** (139.5 → 139.9 KB gzip) for the whole Phase 08 feature.
- Card HTML is complete in the static page with or without JS.
- Layout behaviour is fully covered by unit tests of `projectLayout` and `layoutsByFilter`, plus E2E geometry tests at 375, 800 and 1280 px.

**Costs:**
- `layout-classes.ts` lists every state × layout class literally, because Tailwind only generates classes it can find in source. A new filter value means adding one block there.
- An image's `sizes` can be slightly larger than needed when a filter makes a narrow card wide or the reverse; the browser already has the image by then.
