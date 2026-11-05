import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '../fixtures'

/** Phase 10 — target size, forced colours, text spacing, zoom, orientation and landmarks. */

const overflowX = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

test.describe('target size (WCAG 2.5.8, NFR-A11Y-06)', () => {
  for (const width of [375, 1280]) {
    test(`interactive targets are at least 24×24 at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const small = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>('a[href], button, input, textarea'))
          .filter(
            (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden',
          )
          // Inline exception: links inside a sentence or paragraph of text.
          .filter((el) => !(el.tagName === 'A' && el.closest('p, blockquote')))
          .filter((el) => !el.closest('[hidden]') && el.getAttribute('name') !== '_gotcha')
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width < 24 || r.height < 24)
          .map(
            ({ el, r }) =>
              `${el.tagName} "${(el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`,
          ),
      )
      expect(small).toEqual([])
    })
  }
})

test.describe('forced colours (NFR-BRW-04)', () => {
  test.use({ forcedColors: 'active' })

  test('filled controls keep a visible border; the pressed chip stays distinct', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    const borderless = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('a.rounded-pill, button.rounded-pill'))
        .filter((el) => el.getClientRects().length > 0)
        .filter((el) => parseFloat(getComputedStyle(el).borderTopWidth) === 0)
        .map((el) => (el.textContent ?? '').trim().slice(0, 30)),
    )
    expect(borderless).toEqual([])
    const background = (name: string) =>
      page
        .getByRole('button', { name, exact: true })
        .evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(await background('All')).not.toBe(await background('Websites'))
  })
})

test.describe('text spacing, zoom and reflow (WCAG 1.4.4, 1.4.10, 1.4.12)', () => {
  test('text-spacing overrides cause no overflow or clipping at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.goto('/')
    // Wait for the testimonial slider to hydrate: before that its off-screen slide is not yet
    // aria-hidden (WebKit hydrates later than the other engines).
    await expect(page.locator('[aria-roledescription="slide"][aria-hidden="true"]')).toHaveCount(1)
    await page.addStyleTag({
      content:
        '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }',
    })
    expect(await overflowX(page)).toBeLessThanOrEqual(0)
    // Phase 11.5: some containers clip on purpose (the aria-hidden ticker, the slider's
    // off-screen slide, decorative numerals, the visually hidden CV label). What must never
    // happen is readable text extending past the box that clips it.
    const clipped = await page.evaluate(() => {
      const found: string[] = []
      const hidden = (el: Element) => el.closest('[aria-hidden="true"]') !== null
      for (const box of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
        const cs = getComputedStyle(box)
        if (![cs.overflowX, cs.overflow].some((v) => v === 'hidden' || v === 'clip')) continue
        const b = box.getBoundingClientRect()
        if (hidden(box) || b.width <= 1) continue
        for (const el of Array.from(box.querySelectorAll<HTMLElement>('*'))) {
          if (hidden(el)) continue
          const text = Array.from(el.childNodes).some(
            (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '',
          )
          const r = el.getBoundingClientRect()
          if (!text || r.width <= 1 || r.height <= 1) continue
          if (r.right > b.right + 1 || r.left < b.left - 1)
            found.push(`${el.tagName}: ${(el.textContent ?? '').trim().slice(0, 40)}`)
        }
      }
      return found
    })
    expect(clipped).toEqual([])
  })

  test('text at 200% causes no horizontal scrolling at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
    expect(await overflowX(page)).toBeLessThanOrEqual(0)
  })

  for (const [width, height] of [
    [568, 320],
    [844, 390],
    [1194, 834],
    [2560, 1440],
  ] as const) {
    test(`landscape / wide ${width}×${height}: no horizontal scrolling (1.3.4, NFR-RSP-01/03)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      expect(await overflowX(page)).toBeLessThanOrEqual(0)
    })
  }
})

test.describe('landmarks and floating controls', () => {
  test('all content is inside landmarks, also with the menu open (axe region)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    await page.locator('#skills').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    const closed = await new AxeBuilder({ page })
      .withRules(['region', 'landmark-one-main', 'landmark-unique', 'page-has-heading-one'])
      .analyze()
    expect(closed.violations.map((v) => v.id)).toEqual([])
    await page.getByRole('button', { name: 'Open menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Mohd Shahrukh' })
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    const open = await new AxeBuilder({ page }).withRules(['region']).analyze()
    expect(open.violations.map((v) => v.id)).toEqual([])
  })

  test('back to top never covers footer links at the end of the page', async ({ page }) => {
    for (const width of [375, 1280, 1440]) {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
      )
      const back = page.getByRole('link', { name: 'Back to top' })
      await expect(back).toBeVisible()
      const overlaps = await page.evaluate(() => {
        const b = document.querySelector('a[aria-label="Back to top"]')?.getBoundingClientRect()
        if (!b) return ['missing']
        return Array.from(document.querySelectorAll('footer a'))
          .map((a) => ({ a, r: a.getBoundingClientRect() }))
          .filter(
            ({ r }) => r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top,
          )
          .map(({ a }) => a.textContent ?? '')
      })
      expect(overlaps, `${width}px`).toEqual([])
    }
  })
})
