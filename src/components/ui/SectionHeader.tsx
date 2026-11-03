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
  className?: string
}

/**
 * Numbered section header (COMPONENT_VISUAL_SPEC §7): index label in columns 1–3 and the
 * heading in 4–12 from the lg breakpoint; stacked below. The label is not part of the heading.
 */
export function SectionHeader({
  index,
  eyebrow,
  heading,
  headingId,
  intro,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('grid gap-4 lg:grid-cols-12 lg:gap-x-6 xl:gap-x-8', className)}>
      <p className="text-label font-medium text-text-muted uppercase tabular-nums lg:col-span-3 lg:pt-3">
        {index} — {eyebrow}
      </p>
      <div className="lg:col-span-9">
        <h2 id={headingId} className="font-display text-h2 font-medium">
          {heading}
        </h2>
        {intro ? <div className="mt-6 max-w-[62ch] text-lead">{intro}</div> : null}
      </div>
    </div>
  )
}
