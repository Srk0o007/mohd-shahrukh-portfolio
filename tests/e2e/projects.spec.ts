import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '../fixtures'

/** Phase 08 — projects, hire band and testimonials. */

const ENTERPRISE = [
  'Digital Asset Management',
  'Approval Software Management',
  'Campaign Management',
]
const FILTERS = [
  { name: 'All', count: 10 },
  { name: 'Enterprise products', count: 3 },
  { name: 'Websites', count: 7 },
] as const

const section = (page: Page) => page.locator('section#projects')
const visibleCards = (page: Page) => section(page).locator('article:visible')
const chip = (page: Page, name: string) => page.getByRole('button', { name, exact: true })

async function boxes(page: Page) {
  return visibleCards(page).evaluateAll((cards) =>
    cards.map((card) => {
      const item = card.parentElement as HTMLElement
      const frame = card.firstElementChild as HTMLElement
      const r = item.getBoundingClientRect()
      // aspect-ratio applies to the frame's border box.
      const f = frame.getBoundingClientRect()
      return {
        title: card.querySelector('h3')?.textContent ?? '',
        x: Math.round(r.x),
        y: Math.round(r.y + window.scrollY),
        width: Math.round(r.width),
        ratio: +(f.width / f.height).toFixed(2),
      }
    }),
  )
}

test.describe('project filter (FR-PRJ-02, AC-PRJ-2)', () => {
  for (const width of [375, 800, 1280]) {
    test(`shows the right cards and status at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const status = section(page).locator('[aria-live="polite"]')
      for (const f of FILTERS) {
        // Keyboard activation: focus must stay on the chip (FR-PRJ-02). Mouse clicks are covered
        // elsewhere; Safari/WebKit does not focus buttons on click by design.
        await chip(page, f.name).focus()
        await page.keyboard.press('Enter')
        await expect(chip(page, f.name)).toHaveAttribute('aria-pressed', 'true')
        await expect(chip(page, f.name)).toBeFocused()
        await expect(visibleCards(page)).toHaveCount(f.count)
        await expect(status).toHaveText(`Showing ${f.count} of 10 projects`)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow).toBeLessThanOrEqual(0)
      }
      await chip(page, 'Enterprise products').click()
      await expect(visibleCards(page).locator('h3')).toHaveText(ENTERPRISE)
    })
  }
})

test.describe('uniform grid (Phase 11.5) in every filter state', () => {
  test('≥ 640: two equal columns of 16:10 frames, rows aligned', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    for (const name of ['All', 'Enterprise products', 'Websites']) {
      await chip(page, name).click()
      const all = await boxes(page)
      expect(new Set(all.map((b) => b.width)).size).toBe(1)
      expect(new Set(all.map((b) => b.x)).size).toBe(2)
      for (let i = 0; i + 1 < all.length; i += 2) expect(all[i + 1]?.y).toBe(all[i]?.y)
      for (const b of all) expect(b.ratio).toBe(1.6)
    }
  })

  test('< 640: one column of 16:10 frames', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 })
    await page.goto('/')
    const all = await boxes(page)
    expect(new Set(all.map((b) => b.x)).size).toBe(1)
    for (const b of all) expect(b.ratio).toBe(1.6)
  })
})

test.describe('project cards (FR-PRJ-03–07)', () => {
  test('only SOSUDATECH links out, in a new tab; images lazy-load with dimensions', async ({
    page,
  }) => {
    await page.goto('/')
    const links = section(page).getByRole('link')
    await expect(links).toHaveCount(1)
    await expect(links.first()).toHaveAccessibleName(
      'Visit SOSUDATECH Pvt. Ltd. website (opens in new tab)',
    )
    await expect(links.first()).toHaveAttribute('href', 'https://www.sosudatech.com/')
    await expect(links.first()).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(section(page).getByText('Internal product — no public link')).toHaveCount(3)
    for (const img of await section(page).locator('img').all()) {
      await expect(img).toHaveAttribute('loading', 'lazy')
      await expect(img).toHaveAttribute('width', /\d+/)
      await expect(img).toHaveAttribute('height', /\d+/)
    }
  })

  test('hovering a card slowly zooms its image (Phase 11.5)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    const card = section(page).getByRole('article', { name: 'Virtual University' })
    await card.hover()
    await expect
      .poll(() => card.locator('img').evaluate((img) => getComputedStyle(img).scale))
      .toMatch(/^1\.04( 1\.04)?$/)
  })

  test('no zoom and no lift when reduced motion is preferred (FR-INT-02, FR-PRJ-07)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    const card = section(page).getByRole('article', { name: 'SOSUDATECH Pvt. Ltd.' })
    await card.hover()
    expect(await card.locator('img').evaluate((img) => getComputedStyle(img).scale)).toBe('none')
    expect(await card.evaluate((el) => getComputedStyle(el).transform)).toBe('none')
  })
})

test('"View My Work" and the Projects / Testimonials nav links land on their sections', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('link', { name: 'View My Work' }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(
    page.getByRole('heading', { level: 2, name: 'Some Of My Most Recent Projects' }),
  ).toBeInViewport()
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Testimonials' })
    .click()
  await expect(
    page.getByRole('heading', { level: 2, name: 'What My Colleagues Say' }),
  ).toBeInViewport()
})

test('hire band: phone link and Contact link (FR-CTA-01)', async ({ page }) => {
  await page.goto('/')
  const band = page.getByRole('region', { name: 'Interested in working with me?' })
  await expect(band.getByRole('link', { name: 'Call Me!' })).toHaveAttribute(
    'href',
    'tel:+919760787661',
  )
  await expect(band.getByRole('link', { name: 'Hire Me!' })).toHaveAttribute('href', '#contact')
})

test.describe('testimonials slider (FR-TST-01, ADR 0016)', () => {
  const slider = (page: Page) =>
    page.locator('section#testimonials [aria-roledescription="carousel"]')
  // By attribute: inactive slides are aria-hidden, so role queries cannot see them.
  const slide = (page: Page, n: number) =>
    slider(page).locator(`[aria-roledescription="slide"][aria-label="${n} of 2"]`)

  test('one quote at a time; arrows and dots move between them', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }) // no autoplay while we assert
    await page.goto('/')
    await expect(slider(page)).toHaveAttribute('aria-label', 'Testimonials')
    await expect(slide(page, 1)).not.toHaveAttribute('aria-hidden')
    await expect(slide(page, 2)).toHaveAttribute('aria-hidden', 'true')
    await expect(slider(page).getByRole('img', { name: 'Photo of Sowmit Nag' })).toBeVisible()

    await slider(page).getByRole('button', { name: 'Next testimonial' }).click()
    await expect(slide(page, 2)).not.toHaveAttribute('aria-hidden')
    await expect(slide(page, 1)).toHaveAttribute('aria-hidden', 'true')
    await expect(slider(page).getByRole('button', { name: 'Show testimonial 2' })).toHaveAttribute(
      'aria-current',
      'true',
    )

    await slider(page).getByRole('button', { name: 'Show testimonial 1' }).click()
    await expect(slide(page, 1)).not.toHaveAttribute('aria-hidden')
    await slider(page).getByRole('button', { name: 'Previous testimonial' }).click()
    await expect(slide(page, 2)).not.toHaveAttribute('aria-hidden') // wraps around
  })

  test('autoplay never runs under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.clock.install()
    await page.goto('/')
    await page.clock.runFor(15_000)
    await expect(slide(page, 1)).not.toHaveAttribute('aria-hidden')
  })

  test('autoplay advances after 7 s', async ({ page }) => {
    await page.clock.install()
    await page.goto('/')
    await expect(slide(page, 2)).toHaveAttribute('aria-hidden', 'true') // hydrated: timer set
    await page.mouse.move(0, 0) // keep the pointer off the slider (hover pauses it)
    await page.clock.runFor(7_500)
    await expect(slide(page, 2)).not.toHaveAttribute('aria-hidden')
  })
})

test.describe('without JavaScript (NFR-BRW-03)', () => {
  test.use({ javaScriptEnabled: false })

  test('both testimonials stack and the slider controls are hidden', async ({ page }) => {
    await page.goto('/')
    const testimonials = page.locator('section#testimonials')
    await expect(testimonials.locator('figure:visible')).toHaveCount(2)
    await expect(testimonials.getByRole('button')).toHaveCount(0)
  })

  test('all ten projects are visible and the filter is hidden', async ({ page }) => {
    await page.goto('/')
    await expect(visibleCards(page)).toHaveCount(10)
    await expect(section(page).getByRole('button')).toHaveCount(0)
  })
})

test.describe('axe with a filter applied', () => {
  for (const width of [375, 1280]) {
    test(`${width}px · Websites`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      // Reduced motion: final reveal states, so axe never measures content mid-fade (ADR 0016).
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      await chip(page, 'Websites').click()
      const results = await new AxeBuilder({ page })
        .include('section#projects')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations.map((v) => v.id)).toEqual([])
    })
  }
})
