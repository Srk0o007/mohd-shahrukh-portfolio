import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface SectionHeaderProps {
  /** '01' … '09' (DS-02). */
  index: string
  eyebrow: string
  heading: string
  /** Referenced by the parent <Section aria-labelledby>. */
  headingId: string
  intro?: ReactNode
  /** Centred heading (Testimonials). */
  center?: boolean
  className?: string
}

/**
 * Numbered section header (COMPONENT_VISUAL_SPEC §7, Phase 11.5): a cyan, letter-spaced
 * eyebrow ("01 — About"), a white h2, and a large outlined section number behind them that
 * drifts with parallax (`data-speed`). The number is decorative; the eyebrow is not part of
 * the heading. `isolate` keeps the number above the content column's background.
 */
export function SectionHeader({
  index,
  eyebrow,
  heading,
  headingId,
  intro,
  center = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      data-reveal=""
      className={cn('relative isolate max-w-190', center && 'mx-auto text-center', className)}
    >
      <span
        aria-hidden="true"
        data-speed="0.18"
        className={cn(
          'sec-num pointer-events-none absolute -top-[0.42em] -z-10 text-[6.5rem] leading-none font-bold tracking-[-0.04em] select-none sm:text-[clamp(110px,14vw,190px)]',
          center ? 'left-1/2 -translate-x-1/2' : '-left-[0.06em]',
        )}
      >
        {index}
      </span>
      <p className="on-wave text-label font-bold tracking-[0.18em] text-accent uppercase tabular-nums">
        {index} — {eyebrow}
      </p>
      <h2 id={headingId} className="on-wave mt-2.5 text-h2">
        {heading}
      </h2>
      {intro ? (
        <div className={cn('on-wave mt-4.5 max-w-[58ch] text-lead', center && 'mx-auto')}>
          {intro}
        </div>
      ) : null}
    </div>
  )
}
