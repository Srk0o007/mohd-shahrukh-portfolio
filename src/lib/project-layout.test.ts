import { describe, expect, it } from 'vitest'
import { countsByFilter, layoutsByFilter, projectLayout, type CardLayout } from './project-layout'

const short = (l: CardLayout) => `${l.span}:${l.offset}:${l.frame}:${l.tabletShift ? 'shift' : '-'}`
const sequence = (total: number) =>
  Array.from({ length: total }, (_, i) => short(projectLayout(i, total)))

describe('projectLayout (DS-07)', () => {
  it('all 10: alternating 7+5 / 5+7 pairs with +96 and +64 offsets', () => {
    expect(sequence(10)).toEqual([
      'wide:none:16/10:-',
      'narrow:lg:4/3:shift',
      'narrow:sm:4/3:-',
      'wide:none:16/10:shift',
      'wide:none:16/10:-',
      'narrow:lg:4/3:shift',
      'narrow:sm:4/3:-',
      'wide:none:16/10:shift',
      'wide:none:16/10:-',
      'narrow:lg:4/3:shift',
    ])
  })

  it('3 (enterprise): one pair, then an unpaired wide card', () => {
    expect(sequence(3)).toEqual(['wide:none:16/10:-', 'narrow:lg:4/3:shift', 'wide:none:16/10:-'])
  })

  it('7 (websites): the unpaired final card is wide with no offset', () => {
    const seq = sequence(7)
    expect(seq).toHaveLength(7)
    expect(seq[6]).toBe('wide:none:16/10:-')
    expect(seq.slice(0, 6)).toEqual(sequence(10).slice(0, 6))
  })

  it('a single card is wide', () => {
    expect(sequence(1)).toEqual(['wide:none:16/10:-'])
  })

  it('rejects indices outside the list', () => {
    expect(() => projectLayout(-1, 3)).toThrow(RangeError)
    expect(() => projectLayout(3, 3)).toThrow(RangeError)
    expect(() => projectLayout(1.5, 3)).toThrow(RangeError)
  })

  it('every full row sums to 12 columns at ≥ 1024 px', () => {
    for (const total of [2, 3, 7, 10]) {
      for (let i = 0; i + 1 < total; i += 2) {
        const cols = [projectLayout(i, total), projectLayout(i + 1, total)].map((l) =>
          l.span === 'wide' ? 7 : 5,
        )
        expect(
          cols.reduce((a, b) => a + b, 0),
          `total ${total}, pair ${i / 2}`,
        ).toBe(12)
      }
    }
  })
})

describe('layoutsByFilter / countsByFilter', () => {
  const items = [
    ...Array.from({ length: 3 }, () => ({ group: 'enterprise' as const })),
    ...Array.from({ length: 7 }, () => ({ group: 'website' as const })),
  ]

  it('uses the visible index in each state and null where the item is hidden', () => {
    const layouts = layoutsByFilter(items)
    expect(layouts.map((l) => l.all && short(l.all))).toEqual(sequence(10))
    expect(layouts.slice(0, 3).map((l) => l.enterprise && short(l.enterprise))).toEqual(sequence(3))
    expect(layouts.slice(3).map((l) => l.website && short(l.website))).toEqual(sequence(7))
    expect(layouts.slice(0, 3).every((l) => l.website === null)).toBe(true)
    expect(layouts.slice(3).every((l) => l.enterprise === null)).toBe(true)
  })

  it('counts the visible items per state', () => {
    expect(countsByFilter(items)).toEqual({ all: 10, enterprise: 3, website: 7 })
  })
})
