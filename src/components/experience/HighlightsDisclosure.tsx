'use client'

import { useId, useState, useSyncExternalStore } from 'react'
import { ChevronDownIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

export interface HighlightsDisclosureProps {
  highlights: readonly string[]
  /** Items visible while collapsed (DS-13). */
  visible?: number
  /** Already formatted, e.g. "Show all 11 highlights" / "Show fewer highlights". */
  labels: { more: string; less: string }
}

const noopSubscribe = () => () => {}

/**
 * Experience highlights with progressive disclosure (FR-RES-02, DS-13).
 * Server render and no-JS: every highlight is visible and there is no button.
 * After hydration (detected without a setState-in-effect): lists longer than `visible`
 * collapse and gain a disclosure button with aria-expanded / aria-controls; focus stays on it.
 */
export function HighlightsDisclosure({
  highlights,
  visible = 4,
  labels,
}: HighlightsDisclosureProps) {
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const collapsible = hydrated && highlights.length > visible
  const showAll = !collapsible || expanded

  return (
    <>
      <ul
        id={listId}
        className="flex max-w-[72ch] list-['—__'] flex-col gap-2.5 pl-7 marker:text-text-muted"
      >
        {highlights.map((highlight, index) => (
          <li key={highlight} hidden={!showAll && index >= visible}>
            {highlight}
          </li>
        ))}
      </ul>
      {collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          {expanded ? labels.less : labels.more}
          <ChevronDownIcon size={16} className={cn(expanded && 'rotate-180')} />
        </button>
      ) : null}
    </>
  )
}
