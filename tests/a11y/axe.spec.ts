import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '../fixtures'

/**
 * NFR-A11Y-02 / AC-Q-1: zero axe violations (WCAG 2.0–2.2 A/AA rules) on the home page and the
 * 404 page at every layout breakpoint. Phase 11.5: the site is dark only (ADR 0014), so the
 * light/dark loop is gone.
 *
 * The scans run with reduced motion (ADR 0016): the scroll reveal would otherwise leave content
 * mid-fade (axe measures the partial opacity), and the reduced-motion end state is the same as
 * the end of every reveal. The decorative, `aria-hidden` skills ticker is hidden in that mode;
 * it is pure decoration (WCAG 1.4.3 exception), see ACCESSIBILITY_REPORT.md.
 */
const PAGES = [
  { name: 'home', path: '/' },
  { name: '404', path: '/this-page-does-not-exist' },
] as const
const WIDTHS = [320, 375, 768, 1024, 1280, 1440] as const

for (const { name, path } of PAGES) {
  for (const width of WIDTHS) {
    test(`axe: ${name} · ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('data-js', '')

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
