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

/** A page section: hairline rule on top, fluid vertical padding, standard container. */
export function Section({ id, labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('border-t border-rule py-(--space-section)', className)}
    >
      <Container>{children}</Container>
    </section>
  )
}
