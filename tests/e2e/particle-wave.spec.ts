import { expect, test } from '../fixtures'

/** Phase 11.5 — the decorative 3D particle wave behind the page (ADR 0015). */

const canvas = '[data-testid="particle-wave"]'

test.describe('particle wave background', () => {
  test('starts after load, fills the viewport and sits behind all content', async ({ page }) => {
    await page.goto('/')
    const layer = page.locator(canvas)
    await expect(layer).toHaveAttribute('aria-hidden', 'true')
    // The engine is lazy-loaded after the page is idle; it reports its point count.
    await expect(layer).toHaveAttribute('data-points', /^[1-9]\d*$/, { timeout: 10_000 })
    const box = await layer.evaluate((el) => {
      const style = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      return {
        position: style.position,
        pointerEvents: style.pointerEvents,
        zIndex: style.zIndex,
        width: rect.width,
        height: rect.height,
      }
    })
    expect(box.position).toBe('fixed')
    expect(box.pointerEvents).toBe('none')
    expect(Number(box.zIndex)).toBeLessThan(0)
    expect(box.width).toBe(page.viewportSize()?.width)
    expect(box.height).toBeGreaterThanOrEqual(page.viewportSize()?.height ?? 0)
  })

  test('never intercepts clicks: controls above it receive them', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator(canvas)).toHaveAttribute('data-points', /\d+/, { timeout: 10_000 })
    const cta = page.getByRole('link', { name: 'View My Work' })
    const box = await cta.boundingBox()
    if (!box) throw new Error('CTA not rendered')
    const hit = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.textContent ?? null,
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    )
    expect(hit).toContain('View My Work')
    await cta.click()
    await expect(page).toHaveURL(/#projects$/)
  })

  test('draws visible particles that move over time', async ({ page }) => {
    await page.goto('/')
    const layer = page.locator(canvas)
    await expect(layer).toHaveAttribute('data-points', /\d+/, { timeout: 10_000 })
    await page.waitForTimeout(1200) // past the fade-in
    const snapshot = () =>
      layer.evaluate((el) => {
        const c = el as HTMLCanvasElement
        const data = c.getContext('2d')?.getImageData(0, 0, c.width, c.height).data ?? []
        let painted = 0
        let checksum = 0
        for (let i = 3; i < data.length; i += 4 * 7) {
          if ((data[i] ?? 0) > 0) painted++
          checksum = (checksum + (data[i] ?? 0) * i) % 1_000_000_007
        }
        return { painted, checksum }
      })
    const first = await snapshot()
    await page.waitForTimeout(400)
    const second = await snapshot()
    expect(first.painted).toBeGreaterThan(200)
    expect(second.checksum).not.toBe(first.checksum)
  })

  test('with reduced motion it draws one still frame and does not animate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const layer = page.locator(canvas)
    await expect(layer).toHaveAttribute('data-points', /\d+/, { timeout: 10_000 })
    const checksum = () =>
      layer.evaluate((el) => {
        const c = el as HTMLCanvasElement
        const data = c.getContext('2d')?.getImageData(0, 0, c.width, c.height).data ?? []
        let sum = 0
        for (let i = 3; i < data.length; i += 4 * 7)
          sum = (sum + (data[i] ?? 0) * i) % 1_000_000_007
        return sum
      })
    const first = await checksum()
    await page.mouse.move(400, 500)
    await page.mouse.move(900, 300, { steps: 10 })
    await page.waitForTimeout(500)
    expect(first).toBeGreaterThan(0)
    expect(await checksum()).toBe(first)
  })
})
