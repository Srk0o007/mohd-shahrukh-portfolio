import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '../fixtures'

/** Phase 07 — core portfolio: shell, navigation, sections, CV, no-JS, layout. */

const CV_NAME = 'Download CV (PDF, 72 KB)'
const CV_PATH = '/Mohd_Shahrukh_Resume_03_Nov_2026.pdf'

/*
 * Phase 07 allowed #projects, #testimonials (Phase 08) and #contact (Phase 09) to be missing
 * until their sections shipped (owner decision 2026-11-04). With Contact built in Phase 09 the
 * exception list is gone: every internal link must resolve.
 */

const primaryNav = (page: Page) => page.getByRole('navigation', { name: 'Primary' })
const menuButton = (page: Page) => page.getByRole('button', { name: 'Open menu' })

test('sections render in the approved order with no separate Resume section', async ({ page }) => {
  await page.goto('/')
  // The hire band has no anchor of its own; it is identified by its heading.
  const ids = await page
    .locator('main > section')
    .evaluateAll((els) => els.map((el) => el.id || el.getAttribute('aria-labelledby')))
  expect(ids).toEqual([
    'top',
    'about',
    'services',
    'experience',
    'skills',
    'certifications',
    'education',
    'projects',
    'hire-heading',
    'testimonials',
    'contact',
  ])
  await expect(page.getByRole('heading', { level: 2, name: /resume/i })).toHaveCount(0)
})

test('every internal link resolves: zero unresolved targets (owner condition, Phase 07–09)', async ({
  page,
}) => {
  await page.goto('/')
  const unresolved = await page
    .locator('a[href^="#"], a[href^="/#"]')
    .evaluateAll((links) =>
      [...new Set(links.map((a) => (a.getAttribute('href') ?? '').split('#')[1] ?? ''))].filter(
        (id) => id && !document.getElementById(id),
      ),
    )
  expect(unresolved).toEqual([])
})

test.describe('header layout per breakpoint (COMPONENT_VISUAL_SPEC §2)', () => {
  // Phase 11.5: the CV pill stays in the header at every width (icon only under 560 px) and the
  // inline nav replaces the menu from 1080 px.
  const cases = [
    { width: 375, nav: false, menu: true, cvLabel: false },
    { width: 800, nav: false, menu: true, cvLabel: true },
    { width: 1024, nav: false, menu: true, cvLabel: true },
    { width: 1440, nav: true, menu: false, cvLabel: true },
  ]
  for (const c of cases) {
    test(`${c.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: c.width, height: 900 })
      await page.goto('/')
      const header = page.locator('header')
      await expect(primaryNav(page)).toBeVisible({ visible: c.nav })
      const cvLink = header.getByRole('link', { name: CV_NAME })
      await expect(cvLink).toBeVisible()
      // The accessible name stays complete; under 560 px the visible label is visually hidden.
      const labelWidth = await cvLink.evaluate(
        (a) => a.querySelector('.btn-label')?.getBoundingClientRect().width ?? 0,
      )
      expect(labelWidth > 1).toBe(c.cvLabel)
      await expect(menuButton(page)).toBeVisible({ visible: c.menu })
      await expect(header.getByRole('button', { name: /theme/i })).toHaveCount(0)
    })
  }
})

test('desktop navigation lands each heading below the sticky header (FR-NAV-05)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await primaryNav(page).getByRole('link', { name: 'Experience' }).click()
  await expect(page).toHaveURL(/#experience$/)
  const heading = page.getByRole('heading', { level: 2, name: 'My Experience' })
  await expect(heading).toBeInViewport()
  const headerBottom = await page
    .locator('header')
    .evaluate((h) => h.getBoundingClientRect().bottom)
  const headingTop = await heading.evaluate((h) => h.getBoundingClientRect().top)
  expect(headingTop).toBeGreaterThanOrEqual(headerBottom)
})

test.describe('mobile menu (FR-NAV-02)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
  })

  test('opens by keyboard, focuses the first link and contains Tab focus', async ({ page }) => {
    await menuButton(page).focus()
    await page.keyboard.press('Enter')
    const nav = primaryNav(page)
    await expect(nav.getByRole('link', { name: 'About' })).toBeFocused()
    const panel = nav.locator('xpath=ancestor::div[@id]').first()
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab')
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    }
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Shift+Tab')
      expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(true)
    }
  })

  test('makes the page inert and locks scrolling while open', async ({ page }) => {
    await menuButton(page).click()
    // Main and footer sit inside the content column, which is the element made inert.
    const isInert = (selector: string) =>
      page.locator(selector).evaluate((el) => el.closest('[inert]') !== null)
    await expect.poll(() => isInert('main')).toBe(true)
    expect(await isInert('footer')).toBe(true)
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden')
    const before = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 800)
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => window.scrollY)).toBe(before)
  })

  test('Escape and Close both close the menu and restore focus to the menu button', async ({
    page,
  }) => {
    await menuButton(page).click()
    await page.keyboard.press('Escape')
    await expect(primaryNav(page)).toBeHidden()
    await expect(menuButton(page)).toBeFocused()
    expect(await page.locator('main').evaluate((el) => el.closest('[inert]') === null)).toBe(true)

    await menuButton(page).click()
    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(primaryNav(page)).toBeHidden()
    await expect(menuButton(page)).toBeFocused()
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('')
  })

  test('choosing a link closes the menu and moves focus to the target section', async ({
    page,
  }) => {
    await menuButton(page).click()
    await primaryNav(page).getByRole('link', { name: 'Skills' }).click()
    await expect(primaryNav(page)).toBeHidden()
    await expect(page).toHaveURL(/#skills$/)
    await expect(page.locator('section#skills')).toBeFocused()
    await expect(page.getByRole('heading', { level: 2, name: 'My Skills' })).toBeInViewport()
  })

  test('lists only the section links; the CV pill stays in the header (Phase 11.5)', async ({
    page,
  }) => {
    await menuButton(page).click()
    const panel = page.getByRole('dialog')
    const names = (links: ReturnType<Page['locator']>) =>
      links.evaluateAll((els) =>
        // The menu's "01"–"07" ordinals are aria-hidden: compare the visible labels only.
        els.map((a) => a.querySelector('span:not([aria-hidden])')?.textContent ?? a.textContent),
      )
    const menuLinks = await names(panel.getByRole('navigation', { name: 'Primary' }).locator('a'))
    const desktopLinks = await names(page.locator('header nav[aria-label="Primary"] a'))
    expect(menuLinks).toEqual(desktopLinks)
    expect(menuLinks.length).toBeGreaterThan(5)
    await expect(panel.getByRole('link', { name: CV_NAME })).toHaveCount(0)
    await page.keyboard.press('Escape')
    await expect(page.locator('header').getByRole('link', { name: CV_NAME })).toBeVisible()
  })

  test('axe: open menu has no violations', async ({ page }) => {
    // Reduced motion: final reveal states, so axe never measures content mid-fade (ADR 0016).
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await menuButton(page).click()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations.map((v) => v.id)).toEqual([])
  })
})

test.describe('navigation from the 404 page goes to home-page sections', () => {
  test('desktop nav', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/this-page-does-not-exist')
    await expect(primaryNav(page).getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/#about',
    )
    await primaryNav(page).getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/#about$/)
    await expect(page.getByRole('heading', { level: 2, name: 'Know Me More' })).toBeInViewport()
  })

  test('mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/this-page-does-not-exist')
    await menuButton(page).click()
    await primaryNav(page).getByRole('link', { name: 'Services' }).click()
    await expect(page).toHaveURL(/\/#services$/)
    await expect(
      page.getByRole('heading', { level: 2, name: 'How I Can Help Your Next Project' }),
    ).toBeInViewport()
  })
})

test.describe('experience content and disclosure (FR-RES-01/02)', () => {
  test('all 17 highlights exist; only the AltInvest role collapses to four', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('section#experience')
    await expect(section.locator('article li')).toHaveCount(17)
    const roles = section.locator('article')
    await expect(roles.nth(0).locator('li:visible')).toHaveCount(4)
    await expect(roles.nth(1).locator('li:visible')).toHaveCount(4)
    await expect(roles.nth(2).locator('li:visible')).toHaveCount(2)
    // Locate by role only: the accessible name changes when the list expands.
    const button = section.getByRole('button')
    await expect(button).toHaveCount(1)
    await expect(button).toHaveAccessibleName('Show all 11 highlights')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    // Keyboard activation: Safari/WebKit does not focus buttons on mouse click by design.
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(roles.nth(0).locator('li:visible')).toHaveCount(11)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveAccessibleName('Show fewer highlights')
    await expect(button).toBeFocused()
  })
})

test('CV links: accessible name and PDF response (FR-RES-06)', async ({ page, request }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  const links = page.getByRole('link', { name: CV_NAME })
  await expect(links).toHaveCount(2) // header + Experience section
  for (const link of await links.all()) await expect(link).toHaveAttribute('href', CV_PATH)
  const response = await request.get(CV_PATH)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
})

test.describe('without JavaScript (NFR-BRW-03)', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 375, height: 800 } })

  test('navigation, CV link and every highlight stay available', async ({ page }) => {
    await page.goto('/')
    const nav = primaryNav(page)
    await expect(nav).toBeVisible()
    await expect(nav.getByRole('link')).toHaveCount(7)
    await expect(menuButton(page)).toBeHidden()
    await expect(page.locator('header').getByRole('link', { name: CV_NAME })).toBeVisible()
    await expect(page.locator('section#experience article li:visible')).toHaveCount(17)
    await expect(page.locator('section#experience').getByRole('button')).toHaveCount(0)
  })
})

test.describe('no horizontal overflow (NFR-RSP-01)', () => {
  for (const width of [320, 375, 768, 1024, 1280, 1440]) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
})
