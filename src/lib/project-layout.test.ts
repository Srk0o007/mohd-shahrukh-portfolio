import { describe, expect, it } from 'vitest'
import { countsByFilter, FILTER_VALUES } from './project-layout'

describe('countsByFilter (FR-PRJ-02)', () => {
  const items = [
    ...Array.from({ length: 3 }, () => ({ group: 'enterprise' as const })),
    ...Array.from({ length: 7 }, () => ({ group: 'website' as const })),
  ]

  it('counts the visible items per state', () => {
    expect(countsByFilter(items)).toEqual({ all: 10, enterprise: 3, website: 7 })
  })

  it('has the three filter states, "all" first', () => {
    expect(FILTER_VALUES).toEqual(['all', 'enterprise', 'website'])
  })
})
