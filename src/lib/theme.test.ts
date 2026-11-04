import { describe, expect, it } from 'vitest'
import { applyTheme, currentTheme, readStoredTheme, storeTheme, THEME_SCRIPT } from './theme'

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

describe('theme helpers (FR-THM-02)', () => {
  const memory = () => {
    const data = new Map<string, string>()
    return {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
    }
  }
  const blocked = {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
  }

  it('stores and reads back a valid choice under the "theme" key', () => {
    const storage = memory()
    expect(readStoredTheme(storage)).toBeNull()
    expect(storeTheme(storage, 'dark')).toBe(true)
    expect(storage.getItem('theme')).toBe('dark')
    expect(readStoredTheme(storage)).toBe('dark')
  })

  it('ignores invalid stored values', () => {
    const storage = memory()
    storage.setItem('theme', 'blue')
    expect(readStoredTheme(storage)).toBeNull()
  })

  it('never throws when storage is blocked or missing', () => {
    expect(readStoredTheme(blocked)).toBeNull()
    expect(storeTheme(blocked, 'light')).toBe(false)
    expect(readStoredTheme(undefined)).toBeNull()
    expect(storeTheme(undefined, 'light')).toBe(false)
  })

  it('applies the same attributes as the pre-paint script', () => {
    const root = document.createElement('html')
    applyTheme(root, 'dark')
    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(root.style.colorScheme).toBe('dark')
    expect(currentTheme(root)).toBe('dark')
    applyTheme(root, 'light')
    expect(currentTheme(root)).toBe('light')
  })
})
