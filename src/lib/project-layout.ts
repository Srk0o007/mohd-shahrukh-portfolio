/**
 * Project filter states (FR-PRJ-02, ADR 0013). Phase 11.5 replaced the asymmetric 7/5 rhythm
 * with a uniform two-column grid, so only the filter values and the per-state counts remain.
 */

export type FilterValue = 'all' | 'enterprise' | 'website'

export const FILTER_VALUES = ['all', 'enterprise', 'website'] as const satisfies FilterValue[]

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
