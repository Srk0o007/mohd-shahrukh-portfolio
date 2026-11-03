import { describe, expect, it } from 'vitest'
import { THEME_SCRIPT } from './theme'

/** Runs the pre-paint script against a stubbed browser environment (ADR 0005). */
function run(options: {
  stored: string | null
  systemDark: boolean
  storageThrows?: boolean
}): Record<string, string> {
  const attributes: Record<string, string> = {}
  const element = {
    setAttribute: (name: string, value: string) => {
      attributes[name] = value
    },
    style: { colorScheme: '' },
  }
  const localStorage = {
    getItem: () => {
      if (options.storageThrows) throw new Error('blocked')
      return options.stored
    },
  }
  const matchMedia = () => ({ matches: options.systemDark })
  new Function('document', 'localStorage', 'matchMedia', THEME_SCRIPT)(
    { documentElement: element },
    localStorage,
    matchMedia,
  )
  return { ...attributes, colorScheme: element.style.colorScheme }
}

describe('THEME_SCRIPT', () => {
  it('stays within the 1 KB budget (NFR-PERF-03)', () => {
    expect(new TextEncoder().encode(THEME_SCRIPT).length).toBeLessThanOrEqual(1024)
  })

  it('always sets the data-js flag for progressive enhancement', () => {
    expect(run({ stored: null, systemDark: false })['data-js']).toBe('')
  })

  it('prefers a stored choice over the system preference', () => {
    expect(run({ stored: 'light', systemDark: true })).toMatchObject({
      'data-theme': 'light',
      colorScheme: 'light',
    })
  })

  it('follows the system preference when nothing valid is stored', () => {
    expect(run({ stored: null, systemDark: true })['data-theme']).toBe('dark')
    expect(run({ stored: 'blue', systemDark: false })['data-theme']).toBe('light')
  })

  it('does not throw when storage is blocked', () => {
    expect(run({ stored: null, systemDark: true, storageThrows: true })['data-theme']).toBe('dark')
  })
})
