/**
 * Asymmetric project rhythm (DESIGN_SYSTEM §4, DS-07; COMPONENT_ARCHITECTURE §7).
 * Layout is derived from a card's **visible** index, so every filter state keeps the rhythm.
 */

export type FilterValue = 'all' | 'enterprise' | 'website'

export interface CardLayout {
  /** 7 or 5 of 12 columns at ≥ 1024 px. */
  span: 'wide' | 'narrow'
  /** Vertical offset at ≥ 1024 px: none / +64 px / +96 px. */
  offset: 'none' | 'sm' | 'lg'
  /** Image frame ratio at ≥ 1024 px (tablet is always 4:3, mobile 16:10). */
  frame: '16/10' | '4/3'
  /** +48 px offset for every second card at 768–1023 px. */
  tabletShift: boolean
}

/**
 * ≥ 1024: pairs (0,1), (2,3) … Even pair: wide + narrow (+96). Odd pair: narrow (+64) + wide.
 * An unpaired final card is wide with no offset.
 */
export function projectLayout(index: number, total: number): CardLayout {
  if (!Number.isInteger(index) || index < 0 || index >= total) {
    throw new RangeError(`Card index ${index} is outside 0…${total - 1}`)
  }
  const first = index % 2 === 0
  const tabletShift = !first
  const wide: CardLayout = { span: 'wide', offset: 'none', frame: '16/10', tabletShift }

  if (first && index === total - 1) return wide
  const evenPair = Math.floor(index / 2) % 2 === 0
  if (evenPair) return first ? wide : { span: 'narrow', offset: 'lg', frame: '4/3', tabletShift }
  return first ? { span: 'narrow', offset: 'sm', frame: '4/3', tabletShift } : wide
}

export const FILTER_VALUES = ['all', 'enterprise', 'website'] as const satisfies FilterValue[]

/**
 * For each item, its layout in every filter state (`null` = hidden in that state).
 * Server-side precomputation: the client only switches which state is active.
 */
export function layoutsByFilter<T extends { group: Exclude<FilterValue, 'all'> }>(
  items: readonly T[],
): Record<FilterValue, CardLayout | null>[] {
  const visible = (filter: FilterValue) =>
    items.filter((item) => filter === 'all' || item.group === filter)

  return items.map((item) => {
    const entry = {} as Record<FilterValue, CardLayout | null>
    for (const filter of FILTER_VALUES) {
      const list = visible(filter)
      const position = list.indexOf(item)
      entry[filter] = position === -1 ? null : projectLayout(position, list.length)
    }
    return entry
  })
}

/** Visible count per filter state, for the "Showing n of total" status. */
export function countsByFilter(
  items: readonly { group: Exclude<FilterValue, 'all'> }[],
): Record<FilterValue, number> {
  return {
    all: items.length,
    enterprise: items.filter((item) => item.group === 'enterprise').length,
    website: items.filter((item) => item.group === 'website').length,
  }
}
