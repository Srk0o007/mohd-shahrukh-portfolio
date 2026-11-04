'use client'

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

export interface TestimonialSliderProps {
  /** Carousel name (UiCopy.carouselLabel). */
  label: string
  /** Server-rendered slides (one testimonial card each). */
  slides: readonly ReactNode[]
  /** Already formatted per slide: "1 of 2" and "Show testimonial 1". */
  slideLabels: readonly string[]
  dotLabels: readonly string[]
  previousLabel: string
  nextLabel: string
}

/** Autoplay interval; the active dot's progress bar fills over the same time. */
export const AUTOPLAY_MS = 7000
const SWIPE_PX = 50

const noopSubscribe = () => () => {}

const iconButton =
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-pill border border-line-strong bg-[rgb(255_255_255/0.04)] text-heading transition-colors duration-300 ease-soft hover:border-accent'

/**
 * Testimonial slider (FR-TST-01, ADR 0016 — supersedes A2 "no carousel"). One quote at a time;
 * previous / next buttons, dots with a 7 s progress bar, and swipe. Autoplay pauses while the
 * slider is hovered or focused and never runs under reduced motion. Inactive slides are dimmed
 * and hidden from assistive technology. ARIA carousel pattern: `aria-roledescription`
 * "carousel" / "slide"; the live region is polite only while autoplay is off.
 *
 * Without JavaScript the controls are hidden (`js-only`) and the slides stack, so both quotes
 * stay readable.
 */
export function TestimonialSlider({
  label,
  slides,
  slideLabels,
  dotLabels,
  previousLabel,
  nextLabel,
}: TestimonialSliderProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  const startX = useRef<number | null>(null)
  const count = slides.length
  const autoplay = hydrated && !reducedMotion && !paused && count > 1

  const go = (next: number) => setIndex(((next % count) + count) % count)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Restarted on every slide change, so a manual move gives the new slide its full 7 s.
  useEffect(() => {
    if (!autoplay) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [autoplay, index, count])

  const onPointerDown = (event: PointerEvent) => {
    startX.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (startX.current === null) return
    const dx = event.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      style={{ '--autoplay': `${AUTOPLAY_MS}ms` } as CSSProperties}
      className="mx-auto max-w-215"
    >
      <div className="overflow-hidden rounded-card">
        <ul
          aria-live={autoplay ? 'off' : 'polite'}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={hydrated ? { transform: `translateX(${-100 * index}%)` } : undefined}
          className="flex touch-pan-y transition-transform duration-1000 ease-soft [html:not([data-js])_&]:flex-col [html:not([data-js])_&]:gap-5"
        >
          {slides.map((slide, i) => {
            const inactive = hydrated && i !== index
            return (
              <li
                key={slideLabels[i] ?? i}
                role="group"
                aria-roledescription="slide"
                aria-label={slideLabels[i]}
                aria-hidden={inactive || undefined}
                data-inactive={inactive ? '' : undefined}
                className="flex-[0_0_100%] p-1"
              >
                {slide}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="js-only mt-6.5 flex items-center justify-center gap-4.5">
        <button
          type="button"
          aria-label={previousLabel}
          onClick={() => go(index - 1)}
          className={iconButton}
        >
          <ArrowRightIcon size={20} className="rotate-180" />
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => {
            const current = i === index
            return (
              <button
                key={dotLabels[i] ?? i}
                type="button"
                aria-label={dotLabels[i]}
                aria-current={current || undefined}
                onClick={() => go(i)}
                className="grid size-11 cursor-pointer place-items-center"
              >
                <span
                  // A new key restarts the progress animation on every slide change.
                  key={current ? `on-${index}` : 'off'}
                  className={cn(
                    'relative block h-1 overflow-hidden rounded-[2px] transition-[width,background-color] duration-600 ease-soft',
                    current ? 'w-11 bg-accent/25' : 'w-6.5 bg-[#333]',
                    current && autoplay && 'dot-progress',
                  )}
                />
              </button>
            )
          })}
        </div>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => go(index + 1)}
          className={iconButton}
        >
          <ArrowRightIcon size={20} />
        </button>
      </div>
    </div>
  )
}
