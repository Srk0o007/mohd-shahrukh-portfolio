import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page, type Route } from '@playwright/test'

/** Phase 09 — theme switching, current-section navigation, legacy anchors, back to top, contact. */

const FORM = 'https://formspree.io/f/xleyzgzo'
const SUCCESS = 'Thank you! Your message has been sent.'
const html = (page: Page) => page.locator('html')
const themeButton = (page: Page) => page.locator('header').getByRole('button', { name: /theme/ })
const primaryNav = (page: Page) => page.getByRole('navigation', { name: 'Primary' })

/**
 * Every test intercepts Formspree, so no real submission can ever leave the test run
 * (owner decision 4b: the real test is sent manually from the live site after deployment).
 */
test.beforeEach(async ({ page }) => {
  await page.route('https://formspree.io/**', (route) =>
    route.fulfill({ status: 599, body: 'unexpected request to Formspree in a test' }),
  )
})

test.describe('theme switcher (FR-THM-01–04)', () => {
  test('switches, names the next action, and persists across reloads', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await expect(html(page)).toHaveAttribute('data-theme', 'light')
    await expect(themeButton(page)).toHaveAccessibleName('Switch to dark theme')
    await themeButton(page).click()
    await expect(html(page)).toHaveAttribute('data-theme', 'dark')
    await expect(themeButton(page)).toHaveAccessibleName('Switch to light theme')
    await expect(themeButton(page)).toBeFocused()
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark')
    await page.reload()
    await expect(html(page)).toHaveAttribute('data-theme', 'dark')
  })

  test('a stored choice is applied before first paint (no flash)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
      // Record every data-theme value <html> ever has.
      const seen: string[] = []
      ;(window as unknown as { __themes: string[] }).__themes = seen
      // <html> may not exist yet when init scripts run, so observe the whole document.
      new MutationObserver((records) => {
        for (const record of records) {
          const value = (record.target as Element).getAttribute?.('data-theme')
          if (record.target === document.documentElement && value) seen.push(value)
        }
      }).observe(document, { attributes: true, subtree: true, attributeFilter: ['data-theme'] })
    })
    await page.goto('/')
    const themes = await page.evaluate(() => (window as unknown as { __themes: string[] }).__themes)
    expect(themes.length).toBeGreaterThan(0)
    expect(new Set(themes)).toEqual(new Set(['dark']))
  })

  test('follows live system changes until the visitor chooses (FR-THM-04)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(html(page)).toHaveAttribute('data-theme', 'dark')
    await themeButton(page).click() // choose light explicitly
    await expect(html(page)).toHaveAttribute('data-theme', 'light')
    await page.emulateMedia({ colorScheme: 'light' })
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(html(page)).toHaveAttribute('data-theme', 'light')
  })

  test('works for the visit when storage is blocked', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked')
        },
      })
    })
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await expect(html(page)).toHaveAttribute('data-theme', 'light')
    await themeButton(page).click()
    await expect(html(page)).toHaveAttribute('data-theme', 'dark')
  })

  test('is also in the mobile menu, and is hidden without JS', async ({ page, browser }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const panel = primaryNav(page).locator('xpath=ancestor::div[contains(@class, "fixed")]')
    await panel.getByRole('button', { name: /theme/ }).click()
    await expect(html(page)).toHaveAttribute('data-theme', /dark|light/)

    const noJs = await browser.newContext({ javaScriptEnabled: false })
    const plain = await noJs.newPage()
    await plain.goto(page.url())
    await expect(plain.getByRole('button', { name: /theme/ })).toHaveCount(0)
    await noJs.close()
  })
})

test.describe('navigation (FR-NAV-04/06, FR-INT-05)', () => {
  test('marks the nav item of the section being read (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const link = (name: string) => primaryNav(page).getByRole('link', { name })
    await expect(primaryNav(page).locator('[aria-current]')).toHaveCount(0) // hero: none
    await page.locator('#projects').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    await expect(link('Projects')).toHaveAttribute('aria-current', 'true')
    await expect(primaryNav(page).locator('[aria-current]')).toHaveCount(1)
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
    )
    await expect(link('Contact')).toHaveAttribute('aria-current', 'true')
    // Certifications has no nav item: nothing is marked there.
    await page
      .locator('#certifications')
      .evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    await expect(primaryNav(page).locator('[aria-current]')).toHaveCount(0)
  })

  test('focusing header controls never scrolls the page (sticky header regression)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('#testimonials').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    const before = await page.evaluate(() => Math.round(window.scrollY))
    await page.getByRole('button', { name: 'Open menu' }).focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
    await page.locator('header').getByRole('button', { name: /theme/ }).focus()
    await page.waitForTimeout(400)
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(before)
  })

  test('tabbing into content keeps the focused element below the sticky header (WCAG 2.4.11)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const link = page.getByRole('link', {
      name: 'Visit SOSUDATECH Pvt. Ltd. website (opens in new tab)',
    })
    // Put the link just under the header's band, then focus it as keyboard navigation would.
    await link.evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 20,
        behavior: 'instant',
      }),
    )
    await link.focus()
    await page.waitForTimeout(600)
    const headerBottom = await page
      .locator('header')
      .evaluate((h) => h.getBoundingClientRect().bottom)
    const linkTop = await link.evaluate((el) => el.getBoundingClientRect().top)
    expect(linkTop).toBeGreaterThanOrEqual(headerBottom)
  })

  test('the mobile menu marks the current section when opened', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('#testimonials').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    await expect(html(page)).toHaveAttribute('data-section', 'testimonials')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(primaryNav(page).getByRole('link', { name: 'Testimonials' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  for (const [legacy, target, heading] of [
    ['portfolio', 'projects', 'Some Of My Most Recent Projects'],
    ['resume', 'experience', 'My Experience'],
    ['testimonial', 'testimonials', 'What My Colleagues Say'],
  ] as const) {
    test(`legacy #${legacy} lands on #${target}`, async ({ page }) => {
      await page.goto(`/#${legacy}`)
      await expect(page).toHaveURL(new RegExp(`#${target}$`))
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeInViewport()
    })
  }

  test('back to top appears after the hero and returns focus to the top', async ({ page }) => {
    await page.goto('/')
    const back = page.getByRole('link', { name: 'Back to top' })
    await expect(back).toBeHidden()
    await page.locator('#skills').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
    await expect(back).toBeVisible()
    await expect(back).toHaveAttribute('href', '#top')
    await back.click()
    await expect(page).toHaveURL(/#top$/)
    await expect(page.locator('section#top')).toBeFocused()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
    await expect(back).toBeHidden()
  })
})

test.describe('contact form (FR-CON-02–07)', () => {
  const fill = async (page: Page) => {
    await page.getByLabel(/What is Your Name/).fill('Test Visitor')
    await page.getByLabel(/Your Email Address/).fill('visitor@example.com')
    await page.getByLabel(/How can I Help you/).fill('Intercepted test message.')
  }
  const send = (page: Page) => page.getByRole('button', { name: /^Send/ }).click()

  test('invalid submit: inline errors, first field focused, nothing sent', async ({ page }) => {
    let requests = 0
    await page.route(FORM, (route) => {
      requests += 1
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    })
    await page.goto('/#contact')
    await send(page)
    const name = page.getByLabel(/What is Your Name/)
    await expect(name).toBeFocused()
    await expect(name).toHaveAttribute('aria-invalid', 'true')
    await expect(name).toHaveAccessibleDescription('Please enter your name.')
    expect(requests).toBe(0)
  })

  test('success appears only after Formspree confirms, then the form clears', async ({ page }) => {
    let release: () => void = () => {}
    const held = new Promise<void>((resolve) => (release = resolve))
    let posted = ''
    await page.route(FORM, async (route: Route) => {
      posted = route.request().postData() ?? ''
      await held
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    })
    await page.goto('/#contact')
    await fill(page)
    await send(page)
    const sending = page.getByRole('button', { name: 'Sending…' })
    await expect(sending).toHaveAttribute('aria-disabled', 'true')
    await expect(page.getByRole('status').filter({ hasText: SUCCESS })).toHaveCount(0)
    expect(posted).toContain('Test Visitor')
    expect(posted).toContain('_gotcha')
    release()
    await expect(page.getByRole('status')).toHaveText(SUCCESS)
    await expect(page.getByLabel(/What is Your Name/)).toHaveValue('')
  })

  for (const [label, respond] of [
    ['a 500 response', (r: Route) => r.fulfill({ status: 500, body: '{}' })],
    [
      'a 403 (e.g. reCAPTCHA required)',
      (r: Route) => r.fulfill({ status: 403, body: '{"error":"reCAPTCHA"}' }),
    ],
    ['a network failure', (r: Route) => r.abort('failed')],
  ] as const) {
    test(`${label}: error with email fallback, input kept, never a success`, async ({ page }) => {
      await page.route(FORM, respond)
      await page.goto('/#contact')
      await fill(page)
      await send(page)
      const alert = page.getByRole('alert').filter({ hasText: "couldn't be sent" })
      await expect(alert).toBeVisible()
      await expect(alert.getByRole('link', { name: 'khan.shahrukh156@gmail.com' })).toHaveAttribute(
        'href',
        'mailto:khan.shahrukh156@gmail.com',
      )
      await expect(page.getByText(SUCCESS)).toHaveCount(0)
      await expect(page.getByLabel(/What is Your Name/)).toHaveValue('Test Visitor')
      await expect(page.getByLabel(/How can I Help you/)).toHaveValue('Intercepted test message.')
    })
  }

  test('axe: no violations with errors and with the failure message (both themes)', async ({
    page,
  }) => {
    await page.route(FORM, (route) => route.fulfill({ status: 500, body: '{}' }))
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('/#contact')
      await send(page)
      const withErrors = await new AxeBuilder({ page })
        .include('section#contact')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(withErrors.violations.map((v) => v.id)).toEqual([])
      await fill(page)
      await send(page)
      await expect(page.getByRole('alert').filter({ hasText: "couldn't be sent" })).toBeVisible()
      const withAlert = await new AxeBuilder({ page })
        .include('section#contact')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(withAlert.violations.map((v) => v.id)).toEqual([])
    }
  })
})

test.describe('contact form without JavaScript (FR-CON-06)', () => {
  test.use({ javaScriptEnabled: false })

  test('native required checks block an empty submit', async ({ page }) => {
    let requests = 0
    await page.route(FORM, (route) => {
      requests += 1
      return route.fulfill({ status: 200, body: 'ok' })
    })
    await page.goto('/#contact')
    await page.getByRole('button', { name: /^Send/ }).click()
    await page.waitForTimeout(300)
    expect(requests).toBe(0)
  })

  test('a filled form performs a standard POST to Formspree (intercepted)', async ({ page }) => {
    let posted = ''
    await page.route(FORM, (route) => {
      posted = route.request().postData() ?? ''
      expect(route.request().method()).toBe('POST')
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<p>received</p>' })
    })
    await page.goto('/#contact')
    await page.getByLabel(/What is Your Name/).fill('No JS Visitor')
    await page.getByLabel(/Your Email Address/).fill('nojs@example.com')
    await page.getByLabel(/How can I Help you/).fill('Plain form post.')
    await page.getByRole('button', { name: /^Send/ }).click()
    await expect(page.getByText('received')).toBeVisible()
    const fields = new URLSearchParams(posted)
    expect(fields.get('name')).toBe('No JS Visitor')
    expect(fields.get('email')).toBe('nojs@example.com')
    expect(fields.get('message')).toBe('Plain form post.')
    expect(fields.get('_gotcha')).toBe('')
  })
})
