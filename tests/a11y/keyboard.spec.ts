import { expect, test, type Page } from '@playwright/test'

/**
 * Phase 10 — keyboard walk (WCAG 2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11; NFR-A11Y-05).
 * Tabs through the whole home page and checks every stop. Reduced motion makes scrolling
 * instant, so each stop is measured where the browser leaves it.
 */

interface Stop {
  name: string
  domIndex: number
  outline: boolean
  inViewport: boolean
  underHeader: boolean
  visibleAtCentre: boolean
  positiveTabindex: boolean
}

async function walk(page: Page, max = 120): Promise<Stop[]> {
  const stops: Stop[] = []
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab')
    await page.waitForTimeout(40)
    const stop = await page.evaluate((): Stop | null => {
      const el = document.activeElement as HTMLElement | null
      if (!el || el === document.body) return null
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      const header = document.querySelector('header')?.getBoundingClientRect()
      const inHeader = !!el.closest('header') || el.matches('[href="#main"]') // skip link sits over it
      // The part of the element in the viewport, below the sticky header (for page content).
      const top = Math.max(r.top, inHeader ? 0 : (header?.bottom ?? 0))
      const bottom = Math.min(r.bottom, innerHeight)
      const x = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1)
      const y = Math.min(Math.max((top + bottom) / 2, 0), innerHeight - 1)
      const hit = document.elementFromPoint(x, y)
      return {
        name: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('name') || '')
          .trim()
          .replace(/\s+/g, ' ')
          .slice(0, 50),
        domIndex: Array.prototype.indexOf.call(document.querySelectorAll('*'), el),
        outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
        // 2.4.11 (AA): the focused element is not entirely hidden — some of it is on screen.
        inViewport: bottom > top && r.right > 0 && r.left < innerWidth,
        // Page content never starts under the sticky header when focused.
        underHeader: !inHeader && !!header && r.top < header.bottom - 1 && r.bottom > 0,
        visibleAtCentre: !!hit && (hit === el || el.contains(hit)),
        positiveTabindex: Number(el.getAttribute('tabindex') ?? '0') > 0,
      }
    })
    if (!stop) break
    if (stops.length > 0 && stop.domIndex === stops[0]?.domIndex) break // wrapped around
    stops.push(stop)
  }
  return stops
}

for (const width of [375, 1280]) {
  test.describe(`keyboard walk at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 }, reducedMotion: 'reduce' })

    test('every stop is visible, outlined, unobscured and in DOM order', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const stops = await walk(page)

      expect(stops.length).toBeGreaterThan(25)
      expect(stops[0]?.name).toBe('Skip to main content')
      expect(stops.at(-1)?.name).toBe('Email') // last footer link: nothing traps focus earlier
      const problems = stops.filter(
        (s) =>
          !s.outline || !s.inViewport || s.underHeader || !s.visibleAtCentre || s.positiveTabindex,
      )
      expect(problems).toEqual([])
      const order = stops.map((s) => s.domIndex)
      expect(order).toEqual([...order].sort((a, b) => a - b))

      // Every main control is reachable by keyboard.
      const names = stops.map((s) => s.name)
      for (const expected of [
        'Mohd Shahrukh',
        width < 1280 ? 'Open menu' : 'About',
        'View My Work',
        'Show all 11 highlights',
        'All',
        'Enterprise products',
        'Websites',
        'Call Me!',
        'Hire Me!',
        'Send',
      ]) {
        expect(
          names.some((n) => n.startsWith(expected)),
          expected,
        ).toBe(true)
      }
    })

    test('Shift+Tab walks back to the start', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const stops = await walk(page)
      // The walk ends with focus past the last stop, so it takes one Shift+Tab per stop.
      for (let i = 0; i < stops.length; i++) await page.keyboard.press('Shift+Tab')
      await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
    })
  })
}
