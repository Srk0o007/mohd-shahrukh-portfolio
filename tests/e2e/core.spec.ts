import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

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
  const cases = [
    { width: 375, nav: false, cv: false, menu: true },
    { width: 800, nav: false, cv: true, menu: true },
    { width: 1440, nav: true, cv: true, menu: false },
  ]
  for (const c of cases) {
    test(`${c.width}px`, async ({ page }) => {
      await page.setViewportSize({ width: c.width, height: 900 })
      await page.goto('/')
      const header = page.locator('header')
      await expect(primaryNav(page)).toBeVisible({ visible: c.nav })
      await expect(header.getByRole('link', { name: CV_NAME })).toBeVisible({ visible: c.cv })
      await expect(menuButton(page)).toBeVisible({ visible: c.menu })
      // Phase 09: the theme toggle is in the header at every width.
      await expect(header.getByRole('button', { name: /theme/i })).toBeVisible()
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
    await expect(page.locator('main')).toHaveAttribute('inert', '')
    await expect(page.locator('footer')).toHaveAttribute('inert', '')
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
    await expect(page.locator('main')).not.toHaveAttribute('inert', '')

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

  test('contains the CV download and text-labelled social links', async ({ page }) => {
    await menuButton(page).click()
    // Scope to the overlay: the page behind it (now inert) has its own CV link.
    const panel = primaryNav(page).locator('xpath=ancestor::div[contains(@class, "fixed")]')
    await expect(panel.getByRole('link', { name: CV_NAME })).toBeVisible()
    for (const name of ['GitHub (opens in new tab)', 'LinkedIn (opens in new tab)', 'Email']) {
      await expect(panel.getByRole('link', { name, exact: true })).toBeVisible()
    }
  })

  for (const scheme of ['light', 'dark'] as const) {
    test(`axe: open menu has no violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('/')
      await menuButton(page).click()
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations.map((v) => v.id)).toEqual([])
    })
  }
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
    await button.click()
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
