import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

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
        await chip(page, f.name).click()
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

test.describe('asymmetric grid (DS-07) uses the visible index in every filter state', () => {
  test('≥ 1024: 7 + 5 / 5 + 7 pairs with offsets; frames 16:10 and 4:3', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    const all = await boxes(page)
    const [wide, narrow] = [all[0], all[1]]
    if (!wide || !narrow) throw new Error('missing cards')
    expect(wide.width).toBeGreaterThan(narrow.width)
    expect(narrow.y - wide.y).toBe(96) // even pair: narrow card offset +96
    expect(all[2]?.width).toBe(narrow.width) // odd pair starts narrow
    expect((all[2]?.y ?? 0) - (all[3]?.y ?? 0)).toBe(64) // … offset +64
    expect(wide.ratio).toBe(1.6)
    expect(narrow.ratio).toBe(1.33)

    // Enterprise (3): pair + an unpaired wide card that starts a new row at column 1.
    await chip(page, 'Enterprise products').click()
    const enterprise = await boxes(page)
    expect(enterprise.map((b) => b.width)).toEqual([wide.width, narrow.width, wide.width])
    expect(enterprise[2]?.x).toBe(enterprise[0]?.x)

    // Websites (7): restarts the rhythm from the first visible card.
    await chip(page, 'Websites').click()
    const websites = await boxes(page)
    expect(websites.slice(0, 6).map((b) => b.width)).toEqual(all.slice(0, 6).map((b) => b.width))
    expect(websites[6]?.width).toBe(wide.width)
  })

  test('768–1023: 2-up, every second card offset +48 px, 4:3 frames', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 })
    await page.goto('/')
    const all = await boxes(page)
    expect(new Set(all.map((b) => b.width)).size).toBe(1)
    expect((all[1]?.y ?? 0) - (all[0]?.y ?? 0)).toBe(48)
    for (const b of all) expect(b.ratio).toBe(1.33)
  })

  test('< 768: one column, no offsets, 16:10 frames', async ({ page }) => {
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

  test('the linked card zooms its image on link hover; unlinked cards do not', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    const card = section(page).getByRole('article', { name: 'SOSUDATECH Pvt. Ltd.' })
    const scaleOf = (name: string) =>
      section(page)
        .getByRole('article', { name })
        .locator('img')
        .evaluate((img) => getComputedStyle(img).scale)
    await card.getByRole('link').hover()
    await expect.poll(() => scaleOf('SOSUDATECH Pvt. Ltd.')).toMatch(/^1\.02( 1\.02)?$/)
    await section(page).getByRole('article', { name: 'Virtual University' }).hover()
    expect(await scaleOf('Virtual University')).toBe('none')
  })

  test('no zoom when reduced motion is preferred (FR-INT-02)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    const card = section(page).getByRole('article', { name: 'SOSUDATECH Pvt. Ltd.' })
    await card.getByRole('link').hover()
    expect(await card.locator('img').evaluate((img) => getComputedStyle(img).scale)).toBe('none')
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

test('testimonials: two static figures, no carousel (FR-TST-01)', async ({ page }) => {
  await page.goto('/')
  const testimonials = page.locator('section#testimonials')
  await expect(testimonials.locator('figure')).toHaveCount(2)
  await expect(testimonials.locator('figure:visible')).toHaveCount(2)
  await expect(testimonials.getByRole('button')).toHaveCount(0)
  await expect(testimonials.getByRole('img', { name: 'Photo of Sowmit Nag' })).toBeVisible()
  await expect(testimonials.getByRole('img', { name: 'Photo of Divesh Kumar' })).toBeVisible()
})

test.describe('without JavaScript (NFR-BRW-03)', () => {
  test.use({ javaScriptEnabled: false })

  test('all ten projects are visible and the filter is hidden', async ({ page }) => {
    await page.goto('/')
    await expect(visibleCards(page)).toHaveCount(10)
    await expect(section(page).getByRole('button')).toHaveCount(0)
  })
})

test.describe('axe with a filter applied', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const width of [375, 1280]) {
      test(`${scheme} · ${width}px · Websites`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.emulateMedia({ colorScheme: scheme })
        await page.goto('/')
        await chip(page, 'Websites').click()
        const results = await new AxeBuilder({ page })
          .include('section#projects')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze()
        expect(results.violations.map((v) => v.id)).toEqual([])
      })
    }
  }
})
