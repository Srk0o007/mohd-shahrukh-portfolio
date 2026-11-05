import { expect, test, type Page } from '../fixtures'

/**
 * Phase 11.5 — motion (ADR 0016) and the skills tabs. The motion module loads after idle, so
 * every check first waits for it to start (`data-reveal-on` on <html>, or the header state).
 */

const html = (page: Page) => page.locator('html')
const revealReady = (page: Page) => expect(html(page)).toHaveAttribute('data-reveal-on', '')

test.describe('scroll reveal', () => {
  for (const width of [390, 1440]) {
    test(`never hides what is on screen at load (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await revealReady(page)
      const hiddenOnScreen = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
          .filter((el) => {
            const r = el.getBoundingClientRect()
            return r.height > 0 && r.top < window.innerHeight && r.bottom > 0
          })
          .filter((el) => !el.hasAttribute('data-in'))
          .map((el) => el.textContent?.trim().slice(0, 40)),
      )
      expect(hiddenOnScreen).toEqual([])
      await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('opacity', '1')
    })
  }

  test('reveals on entry and replays when re-entered from below', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await revealReady(page)
    const heading = page.locator('#contact [data-reveal]').first()
    await expect(heading).not.toHaveAttribute('data-in')
    await heading.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect(heading).toHaveAttribute('data-in', '')
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await expect(heading).not.toHaveAttribute('data-in') // below the viewport again
    await heading.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect(heading).toHaveAttribute('data-in', '')
  })
})

test('the header turns denser once the page scrolls past 24 px', async ({ page }) => {
  await page.goto('/')
  await revealReady(page)
  const header = page.locator('#site-header')
  await expect(header).not.toHaveAttribute('data-scrolled')
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
  await expect(header).toHaveAttribute('data-scrolled', '')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(header).not.toHaveAttribute('data-scrolled')
})

test('parallax layers move with scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await revealReady(page)
  const layer = page.locator('#about [data-speed]').first()
  await layer.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  await expect.poll(() => layer.evaluate((el) => el.style.transform)).toMatch(/translate3d/)
})

test('the education journey fills as it scrolls through the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await revealReady(page)
  const journey = page.locator('[data-journey]')
  const progress = () => journey.evaluate((el) => Number(el.style.getPropertyValue('--progress')))
  expect(await progress()).toBe(0)
  // Half-way: the journey's top has passed 60 % of the viewport, its bottom has not.
  await journey.evaluate((el) => el.scrollIntoView({ block: 'end', behavior: 'instant' }))
  await expect.poll(progress).toBeGreaterThan(0)
  expect(await progress()).toBeLessThan(1)
  // Full once its bottom reaches 60 % of the viewport.
  await journey.evaluate((el) =>
    window.scrollBy({
      top: el.getBoundingClientRect().bottom - window.innerHeight * 0.6 + 10,
      behavior: 'instant',
    }),
  )
  await expect.poll(progress).toBe(1)
  await expect(journey.locator('li[data-lit]')).toHaveCount(3)
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('no reveal, no parallax; the journey is drawn in full', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#site-header')).not.toHaveAttribute('data-scrolled')
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
    await expect(page.locator('#site-header')).toHaveAttribute('data-scrolled', '') // module ran
    await expect(html(page)).not.toHaveAttribute('data-reveal-on')
    const moved = await page
      .locator('[data-speed]')
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).transform !== 'none').length)
    expect(moved).toBe(0)
    const journey = page.locator('[data-journey]')
    await journey.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect(journey.locator('li[data-lit]')).toHaveCount(3)
  })
})

test.describe('skills tabs (ARIA tabs pattern)', () => {
  test('arrow keys, Home and End move the selection and show its panel', async ({ page }) => {
    await page.goto('/')
    const tablist = page.getByRole('tablist')
    const tabs = tablist.getByRole('tab')
    const count = await tabs.count()
    expect(count).toBe(9)
    const selected = () => tablist.locator('[aria-selected="true"]')

    await tabs.first().focus()
    await page.keyboard.press('ArrowDown')
    await expect(tabs.nth(1)).toBeFocused()
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#skill-panel-1')).toBeVisible()
    await expect(page.locator('#skill-panel-0')).toBeHidden()

    await page.keyboard.press('End')
    await expect(tabs.nth(count - 1)).toBeFocused()
    await page.keyboard.press('ArrowRight') // wraps to the first tab
    await expect(tabs.first()).toBeFocused()
    await page.keyboard.press('ArrowUp') // wraps to the last tab
    await expect(tabs.nth(count - 1)).toBeFocused()
    await page.keyboard.press('Home')
    await expect(tabs.first()).toBeFocused()
    await expect(selected()).toHaveCount(1)
    await expect(tabs.first()).toHaveAttribute('tabindex', '0')
    await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1')
  })
})

test.describe('skills tabs without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('every panel shows and the tab list is hidden', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('tablist')).toBeHidden()
    await expect(page.locator('[role="tabpanel"]:visible')).toHaveCount(9)
  })
})
