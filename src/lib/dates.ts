/** A "YYYY-MM" string. Structurally compatible with the content `YearMonth` type. */
export type YearMonthString = `${number}-${string}`

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function parse(value: YearMonthString): { year: number; month: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  const year = Number(match?.[1])
  const month = Number(match?.[2])
  if (!match || month < 1 || month > 12) throw new Error(`Invalid YearMonth: ${value}`)
  return { year, month }
}

/** "2024-05" → "May 2024" (FR-RES-01). */
export function formatYearMonth(value: YearMonthString): string {
  const { year, month } = parse(value)
  return `${MONTHS[month - 1]} ${year}`
}

/** "2024-05", "2026-10" → "May 2024 – Oct 2026" (en dash, as in the resume). */
export function formatYearMonthRange(start: YearMonthString, end: YearMonthString): string {
  return `${formatYearMonth(start)} – ${formatYearMonth(end)}`
}

/** Numeric comparison key for "YYYY-MM" values. */
export function yearMonthKey(value: YearMonthString): number {
  const { year, month } = parse(value)
  return year * 12 + month
}
