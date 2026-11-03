import { describe, expect, it } from 'vitest'
import { formatYearMonth, formatYearMonthRange, yearMonthKey } from './dates'

describe('formatYearMonth', () => {
  it.each([
    ['2024-05', 'May 2024'],
    ['2026-10', 'Oct 2026'],
    ['2021-12', 'Dec 2021'],
    ['2020-09', 'Sep 2020'],
    ['2023-01', 'Jan 2023'],
  ] as const)('%s → %s', (input, expected) => {
    expect(formatYearMonth(input)).toBe(expected)
  })

  it.each(['2024-13', '2024-00', '24-05'] as const)('rejects invalid value %s', (input) => {
    expect(() => formatYearMonth(input)).toThrow(/Invalid YearMonth/)
  })
})

describe('formatYearMonthRange', () => {
  it('formats the AltInvest range exactly as the resume (en dash)', () => {
    expect(formatYearMonthRange('2024-05', '2026-10')).toBe('May 2024 – Oct 2026')
  })
})

describe('yearMonthKey', () => {
  it('orders months chronologically across years', () => {
    expect(yearMonthKey('2021-12')).toBeLessThan(yearMonthKey('2022-01'))
    expect(yearMonthKey('2024-05')).toBeGreaterThan(yearMonthKey('2024-04'))
  })
})
