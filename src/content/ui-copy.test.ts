import { describe, expect, it } from 'vitest'
import { formatCopy, uiCopy } from './ui-copy'

describe('formatCopy', () => {
  it('replaces placeholders', () => {
    expect(formatCopy(uiCopy.filterStatus, { n: 3, total: 10 })).toBe('Showing 3 of 10 projects')
    expect(formatCopy(uiCopy.cvAccessibleSuffix, { size: '64 KB' })).toBe(
      '(PDF, 64 KB, opens in new tab)',
    )
  })

  it('leaves unknown placeholders untouched', () => {
    expect(formatCopy('Hello {who}', {})).toBe('Hello {who}')
  })
})
