# ADR 0010: Image handling

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

The live site ships about 9.73 MB of PNG/JPEG with no responsive sizes (audit P1–P4).

**Requirements:**
- Modern formats, responsive sizes and lazy loading (NFR-PERF-06)
- No CLS (NFR-PERF-02)
- Prioritised LCP (NFR-PERF-01)
- Consistent frames with a cover/contain rule (DS-07, DS-08)

## Decision

**Component and assets:**
- Use **`next/image`** for every raster image.
- Use **static imports** from `src/assets/images/…`. Intrinsic width and height are known at build (no CLS), and file hashing gives immutable caching.

**`next.config.ts`:**
- `images.formats: ['image/avif', 'image/webp']`
- `images.qualities: [75]` (the Next 16 default; listed explicitly for clarity)

**LCP portrait:**
- `fetchPriority="high"` and `loading="eager"`.
- **Not** `priority`, which is deprecated in Next 16 (Next docs, Image component, v16.0.0 history).

**All other images:**
- Lazy (the default).
- `sizes` per [COMPONENT_ARCHITECTURE.md §6](../COMPONENT_ARCHITECTURE.md#6-image-sizes).

**Source files:**
- Copied from the live site in Phase 06 and renamed to kebab-case IDs (e.g. `frontier-mining-solutions.png`; this also fixes the "sss" typo).
- Kept as the highest-quality originals; no pre-compression is needed because Vercel serves optimised variants.

**Fit rule:** `object-fit: cover` when width / height ≥ 1.4, otherwise `contain` on `surface-2` (DS-08). It is derived in `toProjectView()`.

**No blur placeholders by default:** they add inline base64 to the HTML for little perceived benefit with fixed-ratio frames. This can be revisited in Phase 11.

## Alternatives considered

| Option | Why not |
|---|---|
| Pre-generated AVIF/WebP with `<picture>` | Manual pipeline (sharp scripts) duplicating what `next/image` does |
| `output: 'export'` + unoptimised images | Ruled out in [ADR 0002](0002-static-prerendering-on-vercel.md) |
| External image CDN | Unnecessary service |

## Consequences

- Image optimisation runs on Vercel and its usage is tiny.
- The total page weight target (≤ 1.5 MB after a full scroll; NFR-PERF-06) is achievable.
- Images must be imported (not `public/` paths) to get dimensions automatically.
