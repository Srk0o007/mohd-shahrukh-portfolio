import type { CardLayout, FilterValue } from '@/lib/project-layout'

/**
 * Tailwind classes for each filter state. The gallery list carries `data-filter` and the
 * `group/gallery` name; each card is pre-rendered with its classes for **every** state, so
 * switching filters needs no client re-render of the cards (owner decision, Phase 08).
 * Every class is written out in full so Tailwind can find it in the source.
 */
const STATE = {
  all: {
    hidden: 'group-data-[filter=all]/gallery:hidden',
    wide: 'lg:group-data-[filter=all]/gallery:col-span-7',
    narrow: 'lg:group-data-[filter=all]/gallery:col-span-5',
    sm: 'lg:group-data-[filter=all]/gallery:mt-16',
    lg: 'lg:group-data-[filter=all]/gallery:mt-24',
    shift: 'md:max-lg:group-data-[filter=all]/gallery:mt-12',
    frameWide: 'lg:group-data-[filter=all]/gallery:aspect-16/10',
    frameNarrow: 'lg:group-data-[filter=all]/gallery:aspect-4/3',
  },
  enterprise: {
    hidden: 'group-data-[filter=enterprise]/gallery:hidden',
    wide: 'lg:group-data-[filter=enterprise]/gallery:col-span-7',
    narrow: 'lg:group-data-[filter=enterprise]/gallery:col-span-5',
    sm: 'lg:group-data-[filter=enterprise]/gallery:mt-16',
    lg: 'lg:group-data-[filter=enterprise]/gallery:mt-24',
    shift: 'md:max-lg:group-data-[filter=enterprise]/gallery:mt-12',
    frameWide: 'lg:group-data-[filter=enterprise]/gallery:aspect-16/10',
    frameNarrow: 'lg:group-data-[filter=enterprise]/gallery:aspect-4/3',
  },
  website: {
    hidden: 'group-data-[filter=website]/gallery:hidden',
    wide: 'lg:group-data-[filter=website]/gallery:col-span-7',
    narrow: 'lg:group-data-[filter=website]/gallery:col-span-5',
    sm: 'lg:group-data-[filter=website]/gallery:mt-16',
    lg: 'lg:group-data-[filter=website]/gallery:mt-24',
    shift: 'md:max-lg:group-data-[filter=website]/gallery:mt-12',
    frameWide: 'lg:group-data-[filter=website]/gallery:aspect-16/10',
    frameNarrow: 'lg:group-data-[filter=website]/gallery:aspect-4/3',
  },
} as const satisfies Record<FilterValue, Record<string, string>>

export function cardLayoutClasses(layouts: Record<FilterValue, CardLayout | null>): {
  item: string
  frame: string
} {
  const item: string[] = []
  const frame: string[] = []
  for (const filter of Object.keys(STATE) as FilterValue[]) {
    const layout = layouts[filter]
    const s = STATE[filter]
    if (!layout) {
      item.push(s.hidden)
      continue
    }
    item.push(layout.span === 'wide' ? s.wide : s.narrow)
    if (layout.offset !== 'none') item.push(s[layout.offset])
    if (layout.tabletShift) item.push(s.shift)
    frame.push(layout.frame === '16/10' ? s.frameWide : s.frameNarrow)
  }
  return { item: item.join(' '), frame: frame.join(' ') }
}

/** COMPONENT_ARCHITECTURE §6, chosen from the default ("All") layout. */
export function cardImageSizes(layout: CardLayout | null): string {
  return layout?.span === 'narrow'
    ? '(min-width: 1280px) 540px, (min-width: 1024px) 40vw, (min-width: 768px) 46vw, 100vw'
    : '(min-width: 1280px) 760px, (min-width: 1024px) 56vw, (min-width: 768px) 46vw, 100vw'
}
