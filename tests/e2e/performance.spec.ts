import { expect, test } from '../fixtures'

/** Phase 11 — performance regressions (PERFORMANCE_REPORT.md). */

test.describe('layout stability (CLS, NFR-PERF-02)', () => {
  test('no layout shift while hydrating, even when loaded scrolled to Experience', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'The Layout Instability API is Chromium-only')
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number }
      w.__cls = 0
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as {
          value: number
          hadRecentInput: boolean
        }[]) {
          if (!entry.hadRecentInput) w.__cls += entry.value
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.setViewportSize({ width: 375, height: 800 })
    // Arrive at #experience: the highlights collapse happens in view if it waits for hydration.
    await page.goto('/#experience')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls)
    expect(cls).toBeLessThan(0.01)
  })

  test('highlights are collapsed in the server HTML when JS runs (pre-paint class)', async ({
    page,
  }) => {
    await page.route('**/_next/static/chunks/*.js', (route) => route.abort()) // never hydrate
    await page.goto('/')
    const items = page.locator('section#experience article').first().locator('li')
    await expect(items).toHaveCount(11)
    await expect(items.and(page.locator(':visible'))).toHaveCount(4)
  })
})

test('the LCP portrait is preloaded with its responsive srcset and high priority', async ({
  page,
}) => {
  await page.goto('/')
  const preload = page.locator('head link[rel="preload"][as="image"]')
  await expect(preload).toHaveCount(1)
  await expect(preload).toHaveAttribute('imagesrcset', /headshot.*w=640/)
  await expect(preload).toHaveAttribute('fetchpriority', 'high')
  const img = page.getByRole('img', { name: 'Portrait of Mohd Shahrukh' })
  await expect(img).toHaveAttribute('loading', 'eager')
  await expect(img).toHaveAttribute('fetchpriority', 'high')
})
