'use client'

import { useState, type ReactNode } from 'react'
import { SectionHeader, type SectionHeaderProps } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/cn'
import type { FilterValue } from '@/lib/project-layout'

export interface FilterOption {
  value: FilterValue
  label: string
  /** Already formatted, e.g. "Showing 3 of 10 projects". */
  status: string
}

export interface ProjectGalleryProps {
  /** The section header; the filter chips sit beside the heading (COMPONENT_VISUAL_SPEC §15). */
  header: Omit<SectionHeaderProps, 'aside' | 'intro' | 'className'>
  filters: readonly FilterOption[]
  /** Server-rendered <li> cards carrying their classes for every filter state. */
  children: ReactNode
}

/**
 * Project filter (FR-PRJ-02, ADR 0013). The only client state is the active filter, written to
 * `data-filter`; the cards are server-rendered and CSS shows or lays them out per state.
 * The chips are server-rendered but `js-only`, so they reserve their space (no layout shift);
 * without JS they are hidden and all ten cards are shown in the "All" layout.
 */
export function ProjectGallery({ header, filters, children }: ProjectGalleryProps) {
  const [filter, setFilter] = useState<FilterValue>('all')
  const status = filters.find((option) => option.value === filter)?.status ?? ''

  const chips = (
    <div className="js-only">
      <div className="flex flex-wrap gap-2">
        {filters.map((option) => {
          const pressed = option.value === filter
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(option.value)}
              className={cn(
                'min-h-11 rounded-pill border px-4.5 text-ui font-medium transition-colors duration-150 ease-standard',
                // Forced colours remove fills: the pressed chip uses the system highlight pair so
                // its state stays visible there (NFR-BRW-04); the border keeps every chip outlined.
                pressed
                  ? 'border-transparent bg-primary text-on-primary forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:forced-color-adjust-none'
                  : 'border-border text-text hover:bg-surface-2',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  )

  return (
    <>
      <SectionHeader {...header} aside={chips} />
      <ul
        data-filter={filter}
        className="group/gallery mt-12 grid items-start gap-y-12 md:grid-cols-2 md:gap-x-6 md:gap-y-16 lg:mt-16 lg:grid-cols-12 lg:gap-y-24 xl:gap-x-8"
      >
        {children}
      </ul>
    </>
  )
}
