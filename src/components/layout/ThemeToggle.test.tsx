import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const labels = { toDark: 'Switch to dark theme', toLight: 'Switch to light theme' }
const root = document.documentElement

/** A matchMedia stub whose "change" listeners the test can fire. */
function stubSystem() {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.add(listener),
        removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.delete(listener),
      }) as unknown as MediaQueryList,
  )
  return (dark: boolean) => {
    for (const listener of listeners) listener({ matches: dark } as MediaQueryListEvent)
  }
}

// The component keeps a per-visit choice in module scope, so each test loads a fresh copy.
async function renderToggle() {
  vi.resetModules()
  const { ThemeToggle } = await import('./ThemeToggle')
  render(<ThemeToggle labels={labels} />)
  return screen.getByRole('button')
}

describe('ThemeToggle (FR-THM-01–04)', () => {
  beforeEach(() => {
    window.localStorage.clear()
    root.setAttribute('data-theme', 'light')
    root.style.colorScheme = 'light'
  })
  afterEach(() => {
    root.removeAttribute('data-theme')
  })

  it('is a js-only button with both action labels selected by CSS (moon / sun icons)', async () => {
    const button = await renderToggle()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('js-only')
    const [moon, sun] = Array.from(button.querySelectorAll('svg'))
    expect(moon).toHaveClass('dark:hidden')
    expect(sun).toHaveClass('hidden', 'dark:block')
    expect(screen.getByText(labels.toDark)).toHaveClass('sr-only', 'dark:hidden')
    expect(screen.getByText(labels.toLight)).toHaveClass('sr-only', 'hidden', 'dark:inline')
  })

  it('switches theme on click and persists the choice under "theme"', async () => {
    const user = userEvent.setup()
    const button = await renderToggle()
    await user.click(button)
    expect(root.getAttribute('data-theme')).toBe('dark')
    expect(root.style.colorScheme).toBe('dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')
    await user.click(button)
    expect(root.getAttribute('data-theme')).toBe('light')
    expect(window.localStorage.getItem('theme')).toBe('light')
  })

  it('follows live system changes until the visitor chooses (FR-THM-04)', async () => {
    const user = userEvent.setup()
    const fire = stubSystem()
    const button = await renderToggle()
    fire(true)
    expect(root.getAttribute('data-theme')).toBe('dark')
    fire(false)
    expect(root.getAttribute('data-theme')).toBe('light')
    await user.click(button) // explicit choice: dark
    fire(false)
    expect(root.getAttribute('data-theme')).toBe('dark')
  })

  it('on mount, catches a system change that happened before hydration', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: true, // system is now dark; the pre-paint script had applied light
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    )
    await renderToggle()
    expect(root.getAttribute('data-theme')).toBe('dark')
  })

  it('ignores system changes when a stored choice exists', async () => {
    window.localStorage.setItem('theme', 'light')
    const fire = stubSystem()
    await renderToggle()
    fire(true)
    expect(root.getAttribute('data-theme')).toBe('light')
  })

  it('still works for the visit when storage is blocked', async () => {
    const user = userEvent.setup()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const fire = stubSystem()
    const button = await renderToggle()
    await user.click(button)
    expect(root.getAttribute('data-theme')).toBe('dark')
    fire(false) // the in-memory choice still wins over the system
    expect(root.getAttribute('data-theme')).toBe('dark')
  })
})
