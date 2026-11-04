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
  /** Controls beside the heading (e.g. the project filter): below it under 1024 px, to its
   *  right and bottom-aligned from 1024 px (COMPONENT_VISUAL_SPEC §15). */
  aside?: ReactNode
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
  aside,
  className,
}: SectionHeaderProps) {
  const title = (
    <h2 id={headingId} className="font-display text-h2 font-medium">
      {heading}
    </h2>
  )
  return (
    <div className={cn('grid gap-4 lg:grid-cols-12 lg:gap-x-6 xl:gap-x-8', className)}>
      <p className="text-label font-medium text-text-muted uppercase tabular-nums lg:col-span-3 lg:pt-3">
        {index} — {eyebrow}
      </p>
      <div className="lg:col-span-9">
        {aside ? (
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="lg:min-w-0 lg:flex-1">{title}</div>
            <div className="lg:shrink-0">{aside}</div>
          </div>
        ) : (
          title
        )}
        {intro ? <div className="mt-6 max-w-[62ch] text-lead">{intro}</div> : null}
      </div>
    </div>
  )
}
