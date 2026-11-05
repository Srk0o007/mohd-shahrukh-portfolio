import {
  HEADER_SCROLL_PX,
  isMilestoneLit,
  isNearViewport,
  journeyProgress,
  parallaxOffset,
  staggerDelay,
} from './math'

/**
 * Scroll motion for the whole page (ADR 0016), loaded lazily by `MotionLayer` after the browser
 * is idle, so none of it is first-load JavaScript. One rAF-throttled passive scroll listener
 * drives:
 * - the header: `data-scrolled` past 24 px (denser glass, cyan rim);
 * - parallax: `[data-speed]` layers move with `transform: translate3d` relative to their
 *   parent's distance from the viewport centre (35 % below 768 px, off under reduced motion);
 * - the education journey: `--progress` on `[data-journey]` and `data-lit` on each milestone.
 *
 * Scroll reveal uses two IntersectionObservers: `[data-reveal]` elements fade in once 8 % of
 * them is inside the viewport (minus an 8 % bottom margin), and are reset only when they have
 * left the viewport *entirely* below, so they replay when re-entered from below. Resetting on
 * the first observer alone would hide elements peeking into the bottom margin at load. Elements already on screen when the module starts are
 * marked `data-in` *before* `data-reveal-on` goes on `<html>`, so nothing visible is ever
 * hidden. Children of `[data-stagger]` get a 90 ms `--delay` per step (max 5). The reveal is
 * off under reduced motion; the CSS also forces every final state there.
 */
export function createMotion(): { destroy: () => void } {
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const header = document.getElementById('site-header')
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'))
  const journey = document.querySelector<HTMLElement>('[data-journey]')
  const nodes = journey ? Array.from(journey.querySelectorAll<HTMLElement>('.journey-node')) : []

  const parallax = () => {
    const viewport = { width: window.innerWidth, height: window.innerHeight }
    for (const layer of layers) {
      const parent = layer.parentElement
      if (!parent) continue
      const box = parent.getBoundingClientRect()
      if (!isNearViewport(box, viewport.height)) continue
      const offset = parallaxOffset(box, viewport, Number.parseFloat(layer.dataset.speed ?? ''))
      layer.style.transform = `translate3d(0,${offset.toFixed(1)}px,0)`
    }
  }

  const clearParallax = () => {
    for (const layer of layers) layer.style.transform = ''
  }

  const drawJourney = () => {
    if (!journey) return
    const box = journey.getBoundingClientRect()
    const progress = reduce.matches ? 1 : journeyProgress(box.top, box.height, window.innerHeight)
    journey.style.setProperty('--progress', progress.toFixed(3))
    for (const node of nodes) {
      const offset = node.getBoundingClientRect().top - box.top
      node.parentElement?.toggleAttribute('data-lit', isMilestoneLit(progress, box.height, offset))
    }
  }

  let frame = 0
  const update = () => {
    frame = 0
    header?.toggleAttribute('data-scrolled', window.scrollY > HEADER_SCROLL_PX)
    if (!reduce.matches) parallax()
    drawJourney()
  }
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update)
  }

  let revealer: IntersectionObserver | undefined
  let resetter: IntersectionObserver | undefined
  const revealed = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

  const startReveal = () => {
    if (revealer || reduce.matches || typeof IntersectionObserver !== 'function') return
    const elements = revealed()
    for (const element of elements) {
      const delay = staggerIndex(element)
      if (delay !== undefined) element.style.setProperty('--delay', `${staggerDelay(delay)}ms`)
      const box = element.getBoundingClientRect()
      if (box.top < window.innerHeight && box.bottom > 0) element.setAttribute('data-in', '')
    }
    root.setAttribute('data-reveal-on', '')
    revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.setAttribute('data-in', '')
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    resetter = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          entry.target.removeAttribute('data-in')
        }
      }
    })
    for (const element of elements) {
      revealer.observe(element)
      resetter.observe(element)
    }
  }

  const stopReveal = () => {
    revealer?.disconnect()
    resetter?.disconnect()
    revealer = undefined
    resetter = undefined
    root.removeAttribute('data-reveal-on')
    for (const element of revealed()) {
      element.removeAttribute('data-in')
      element.style.removeProperty('--delay')
    }
  }

  const onReduceChange = () => {
    if (reduce.matches) {
      stopReveal()
      clearParallax()
    } else {
      startReveal()
    }
    schedule()
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  reduce.addEventListener('change', onReduceChange)
  startReveal()
  update()

  return {
    destroy() {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduce.removeEventListener('change', onReduceChange)
      if (frame) window.cancelAnimationFrame(frame)
      stopReveal()
      clearParallax()
      header?.removeAttribute('data-scrolled')
    },
  }
}

/** Position of the element's branch inside its nearest `[data-stagger]` group, if any. */
function staggerIndex(element: HTMLElement): number | undefined {
  const group = element.parentElement?.closest('[data-stagger]')
  if (!group) return undefined
  let child: Element = element
  while (child.parentElement && child.parentElement !== group) child = child.parentElement
  return Array.prototype.indexOf.call(group.children, child) as number
}
