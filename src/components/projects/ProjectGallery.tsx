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
  /** The section header; the filter chips sit beside it (COMPONENT_VISUAL_SPEC §15). */
  header: Omit<SectionHeaderProps, 'intro' | 'center' | 'className'>
  /** Accessible name of the chip group. */
  groupLabel: string
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
export function ProjectGallery({ header, groupLabel, filters, children }: ProjectGalleryProps) {
  const [filter, setFilter] = useState<FilterValue>('all')
  const status = filters.find((option) => option.value === filter)?.status ?? ''

  const chips = (
    <div className="js-only" data-reveal="">
      <div role="group" aria-label={groupLabel} className="flex flex-wrap gap-2">
        {filters.map((option) => {
          const pressed = option.value === filter
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(option.value)}
              className={cn(
                'min-h-11 cursor-pointer rounded-pill border px-4.5 text-small font-bold transition-[color,border-color,background] duration-400 ease-soft',
                // Pressed: a gradient border on black. Forced colours remove fills, so the pressed
                // chip uses the system highlight pair there (NFR-BRW-04); the border keeps every
                // chip outlined.
                pressed
                  ? 'chip-pressed text-heading forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:forced-color-adjust-none'
                  : 'border-line-strong bg-[rgb(255_255_255/0.03)] text-sub hover:border-accent hover:text-heading',
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
      <div className="mb-11 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <SectionHeader {...header} />
        {chips}
      </div>
      <ul
        data-filter={filter}
        data-stagger=""
        className="group/gallery grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2"
      >
        {children}
      </ul>
    </>
  )
}
