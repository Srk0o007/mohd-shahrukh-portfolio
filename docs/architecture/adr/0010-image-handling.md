# ADR 0010: Image handling

- **Status:** Accepted
- **Date:** 2026-11-04
- **Revision:** 2026-11-04, before merge, per owner review. Image optimisation is now stated as platform-managed runtime processing; cost and limits are verified in Phase 12.

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
- Kept as the highest-quality originals; no pre-compression is needed because Vercel's optimiser generates the variants.

**Fit rule:** `object-fit: cover` when width / height ≥ 1.4, otherwise `contain` on `surface-2` (DS-08). It is derived in `toProjectView()`.

**No blur placeholders by default:** they add inline base64 to the HTML for little perceived benefit with fixed-ratio frames. This can be revisited in Phase 11.

## Addendum (Phase 07, 2026-11-04)

Server-rendered images use **`getImageProps()`** (exported by `next/image`) with a plain `<img>` (`src/components/ui/ResponsiveImage.tsx`). It is the same optimisation pipeline (`/_next/image` srcset, `sizes`, `fetchPriority`, intrinsic `width`/`height`), but without the `next/image` **client component**. Measured in Phase 07, the client component added about 6 KB gzip to first-load JS (NFR-PERF-05). The `@next/next/no-img-element` lint rule is disabled on that one line, with this justification.

## Addendum (Phase 11, 2026-11-04)

The LCP portrait (`ResponsiveImage` with `priority`) also hoists a responsive `<link rel="preload" as="image" imagesrcset imagesizes fetchpriority="high">` into `<head>` through React 19's `preload()`. This is what `next/image`'s `priority` used to do. It lets the browser request the portrait while it is still parsing `<head>`.

Measured effect in Lighthouse (PERFORMANCE_REPORT.md): neutral within run-to-run noise. It is kept as standard practice.

## Alternatives considered

| Option | Why not |
|---|---|
| Pre-generated AVIF/WebP with `<picture>` | Manual pipeline (sharp scripts) duplicating what `next/image` does |
| `output: 'export'` + unoptimised images | Ruled out in [ADR 0002](0002-static-prerendering-on-vercel.md) |
| External image CDN | Unnecessary service |

## Consequences

- **Runtime processing:** `next/image` optimisation is **platform-managed runtime processing**, not build-time work. Vercel transforms a source image the first time each width/format is requested (`/_next/image`) and then serves it from cache. This is the only runtime processing in the deployment besides the third-party form endpoint ([ADR 0002 §Runtime compute boundaries](0002-static-prerendering-on-vercel.md#runtime-compute-boundaries)).
- **Expected volume:** about 20 source images × the widths requested × 2 formats (AVIF, WebP). Static imports give content-hashed URLs and long cache lifetimes, so repeat transformations are rare.
- **Cost and limits** are confirmed in **Phase 12** against Vercel's current plan terms. If unacceptable: pre-optimise the assets and set `images.unoptimized: true`, or use the `output: 'export'` fallback (ADR 0002).
- The total page weight target (≤ 1.5 MB after a full scroll; NFR-PERF-06) is achievable.
- Images must be imported (not `public/` paths) to get dimensions automatically.
