import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * NFR-A11Y-02 / AC-Q-1: zero axe violations (WCAG 2.0–2.2 A/AA rules) on the home page and the
 * 404 page, in both themes, at 375 px and 1280 px.
 */
const PAGES = [
  { name: 'home', path: '/' },
  { name: '404', path: '/this-page-does-not-exist' },
] as const
const SCHEMES = ['light', 'dark'] as const
const WIDTHS = [375, 1280] as const

for (const { name, path } of PAGES) {
  for (const scheme of SCHEMES) {
    for (const width of WIDTHS) {
      test(`axe: ${name} · ${scheme} · ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ colorScheme: scheme })
        await page.goto(path)
        await expect(page.locator('html')).toHaveAttribute('data-theme', scheme)

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()

        const summary = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
        }))
        expect(summary).toEqual([])
      })
    }
  }
}
