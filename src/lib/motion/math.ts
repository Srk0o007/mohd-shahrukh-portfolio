/**
 * Pure helpers for the motion module (ADR 0016). Kept free of the DOM so they can be unit-tested.
 */

/** Header turns denser once the page has scrolled past this many pixels. */
export const HEADER_SCROLL_PX = 24
/** Parallax is gentler on phones so floating elements stay near their anchors. */
export const MOBILE_PARALLAX_SCALE = 0.35
export const MOBILE_MAX_WIDTH = 768
/** Reveal stagger: 90 ms per sibling, capped at five steps so long lists stay quick. */
export const STAGGER_MS = 90
export const STAGGER_MAX_STEPS = 5

/**
 * Parallax offset for a `[data-speed]` layer: its parent's distance from the viewport centre,
 * times the layer's speed (negative = moves up as you scroll down), scaled down on phones.
 */
export function parallaxOffset(
  parent: { top: number; height: number },
  viewport: { width: number; height: number },
  speed: number,
): number {
  if (!Number.isFinite(speed)) return 0
  const scale = viewport.width < MOBILE_MAX_WIDTH ? MOBILE_PARALLAX_SCALE : 1
  return (parent.top + parent.height / 2 - viewport.height / 2) * speed * scale
}

/** Layers whose parent is far outside the viewport are skipped. */
export function isNearViewport(box: { top: number; bottom: number }, viewportHeight: number) {
  return box.bottom >= -200 && box.top <= viewportHeight + 200
}

/**
 * Education journey fill, 0–1: starts when the journey's top reaches 60 % down the viewport and
 * is complete when its bottom gets there.
 */
export function journeyProgress(top: number, height: number, viewportHeight: number): number {
  if (height <= 0) return 1
  const progress = (viewportHeight * 0.6 - top) / height
  return Math.min(1, Math.max(0, progress))
}

/**
 * A milestone lights up once the fill (progress × journey height) reaches its node, measured
 * from the top of the journey. A 2 px tolerance lights it as the fill touches the node's edge.
 */
export function isMilestoneLit(progress: number, journeyHeight: number, nodeOffset: number) {
  return progress * journeyHeight >= nodeOffset - 2
}

/** Delay for the n-th sibling (0-based) inside a staggered grid or list. */
export function staggerDelay(index: number): number {
  return Math.min(Math.max(index, 0), STAGGER_MAX_STEPS) * STAGGER_MS
}
