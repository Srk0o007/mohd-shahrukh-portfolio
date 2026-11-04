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
 *
 * Collapsed **from the first paint** (Phase 11, no layout shift on hydration): the extra items
 * carry `js-collapsed`, which CSS hides only when the pre-paint script has set `html[data-js]`,
 * and the button is server-rendered `js-only`, so it holds its space from the start.
 * Without JavaScript every highlight is visible and the button is hidden.
 * After hydration the items also get the `hidden` attribute; the button toggles them with
 * `aria-expanded` / `aria-controls`, and focus stays on it.
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
  const collapsible = highlights.length > visible

  return (
    <>
      <ul
        id={listId}
        className="marker:text-text-muted flex max-w-[72ch] list-['—__'] flex-col gap-2.5 pl-7"
      >
        {highlights.map((highlight, index) => {
          const collapsed = collapsible && !expanded && index >= visible
          return (
            <li
              key={highlight}
              className={cn(collapsed && 'js-collapsed')}
              hidden={hydrated && collapsed}
            >
              {highlight}
            </li>
          )
        })}
      </ul>
      {collapsible ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
          className="js-only mt-5 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          {expanded ? labels.less : labels.more}
          <ChevronDownIcon size={16} className={cn(expanded && 'rotate-180')} />
        </button>
      ) : null}
    </>
  )
}
