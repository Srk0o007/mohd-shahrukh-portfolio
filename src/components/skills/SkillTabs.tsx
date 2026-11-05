'use client'

import { useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export interface SkillTab {
  label: string
  count: number
  fileName: string
}

export interface SkillTabsProps {
  /** Accessible name of the tab list (UiCopy.skillsTabsLabel). */
  label: string
  tabs: readonly SkillTab[]
  /** "50 skills · 9 groups". */
  meta: string
  /** Server-rendered panel contents, one per tab (code view + screen-reader list). */
  panels: readonly ReactNode[]
}

const noopSubscribe = () => () => {}

/**
 * Skills editor (FR-RES-03, COMPONENT_VISUAL_SPEC §13, Phase 11.5): a vertical tab list of the
 * skill groups beside a code-editor window. ARIA tabs with automatic activation: arrow keys,
 * Home and End move between tabs. The only client state is the selected index.
 *
 * Without JavaScript the tab list is hidden (`js-only`) and every panel is shown; with JS the
 * other panels are hidden from the first paint (`js-collapsed`, no layout shift), then by the
 * `hidden` attribute after hydration. Showing a panel restarts its line animation.
 */
export function SkillTabs({ label, tabs, meta, panels }: SkillTabsProps) {
  const [selected, setSelected] = useState(0)
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1
    const next = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setSelected(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 mid:grid-cols-[minmax(0,300px)_minmax(0,1fr)] [html:not([data-js])_&]:grid-cols-1">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        data-reveal=""
        className="js-only grid [scrollbar-width:thin] auto-cols-max grid-flow-col gap-1 overflow-x-auto pb-1.5 mid:auto-cols-auto mid:grid-flow-row mid:overflow-visible mid:pb-0"
      >
        {tabs.map((tab, index) => {
          const active = index === selected
          return (
            <button
              key={tab.label}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`skill-tab-${index}`}
              aria-controls={`skill-panel-${index}`}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'grid min-h-12 cursor-pointer grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-md border px-3.5 py-2 text-left text-ui font-bold transition-[color,background-color,border-color,padding-left] duration-450 ease-soft',
                active
                  ? 'border-[rgb(0_194_255/0.22)] bg-[linear-gradient(90deg,rgb(0_194_255/0.12),rgb(0_194_255/0))] text-heading mid:pl-5'
                  : 'border-transparent text-sub hover:bg-[rgb(255_255_255/0.03)] hover:text-heading',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'text-xs tabular-nums transition-colors duration-450 ease-soft',
                  active ? 'text-accent' : 'text-faint',
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{tab.label}</span>
              <span
                className={cn(
                  'min-w-7 rounded-pill border px-2 text-center text-xs tabular-nums',
                  active ? 'border-accent text-accent' : 'border-line-strong',
                )}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      <Card hover={false} className="overflow-hidden">
        <div className="flex items-center gap-3.5 border-b border-line bg-[rgb(255_255_255/0.02)] px-4.5 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="size-2.5 rounded-full bg-accent" />
            <i className="size-2.5 rounded-full bg-[#2a2a2a]" />
            <i className="size-2.5 rounded-full bg-[#2a2a2a]" />
          </span>
          <span
            aria-hidden="true"
            className="rounded-sm border border-[rgb(0_194_255/0.2)] bg-accent/8 px-3 py-0.5 text-small font-bold text-heading"
          >
            {tabs[selected]?.fileName}
          </span>
          <span className="ml-auto text-label text-faint">{meta}</span>
        </div>
        {panels.map((panel, index) => {
          const collapsed = index !== selected
          return (
            <div
              key={tabs[index]?.label ?? index}
              role="tabpanel"
              id={`skill-panel-${index}`}
              aria-labelledby={`skill-tab-${index}`}
              tabIndex={0}
              className={cn(collapsed && 'js-collapsed')}
              hidden={hydrated && collapsed}
            >
              {panel}
            </div>
          )
        })}
      </Card>
    </div>
  )
}
