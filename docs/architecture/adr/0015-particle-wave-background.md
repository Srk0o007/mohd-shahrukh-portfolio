# ADR 0015: 3D particle-wave background

- **Status:** Accepted (owner decision, 2026-11-05)
- **Date:** 2026-11-05

## Context

The frozen design places an animated cyan particle wave behind the content column. It must not cost first-load JS, block input, or harm reading and accessibility.

## Decision

- **Engine:** a dependency-free TypeScript engine in `src/lib/particle-wave/`: grid, camera, ripples and a canvas 2D renderer. It was copied unchanged from the design handoff, with unit tests.
- **Loading:** `ParticleWaveLayer` (client) renders a fixed `<canvas>` (`-z-10`, `pointer-events: none`, `aria-hidden`, `100lvh`). It imports the engine with `import()` once the browser is idle after `load`, with a timeout fallback for Safari.
- **Colour:** read from CSS (`--particle-rgb`, `--particle-alpha`).
- **Reduced motion:** a still frame.
- **Hidden** in forced-colours mode and in print.
- **Visibility:** the content column is solid black from 1024 px, so the wave shows only in the side areas; below 1024 px it is translucent (`rgb(0 0 0 / .72)`).

## Consequences

- **Budget:** about 3.8 KB gzip in its own chunk, outside the first-load budget.
- **Tests:** `tests/e2e/particle-wave.spec.ts` checks it sits behind content, never takes clicks, animates, and is still under reduced motion.
- **Ongoing CPU/GPU cost** while the page is open. It pauses when the tab is hidden.
