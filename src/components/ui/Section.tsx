import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

export interface SectionProps {
  /** Anchor target, e.g. "about" (FR-NAV-05). */
  id: string
  /** id of the section's <h2> (NFR-A11Y-03). */
  labelledBy: string
  className?: string
  children: ReactNode
}

/** A page section: fluid vertical padding (64 → 120 px) and the standard container. */
export function Section({ id, labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // Programmatic focus target for in-page navigation (FR-NAV-02); not in the tab order.
      tabIndex={-1}
      className={cn('py-(--space-section) focus:outline-none', className)}
    >
      <Container>{children}</Container>
    </section>
  )
}
