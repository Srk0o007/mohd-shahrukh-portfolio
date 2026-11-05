import { expect, test, WEBKIT_TAB_SKIPS_LINKS, type ConsoleMessage } from '../fixtures'

/** Phase 06 foundation checks: rendering, dark-only theme, fonts, metadata, headers, no-JS. */

const CV_PATH = '/Mohd_Shahrukh_Resume_03_Nov_2026.pdf'

test.describe('home page', () => {
  test('renders statically with the pre-paint flags and no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error' || msg.type() === 'warning') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))

    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'Mohd Shahrukh' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('data-js', '')
    expect(errors, 'console errors/warnings (incl. CSP violations)').toEqual([])
  })

  test('skip link is first in tab order and moves focus to <main> (FR-NAV-03)', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === 'webkit', WEBKIT_TAB_SKIPS_LINKS)
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to main content' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page.locator('main#main')).toBeFocused()
  })
})

test.describe('dark only (ADR 0014)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`stays dark when the system prefers ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('/')
      const html = page.locator('html')
      await expect(html).not.toHaveAttribute('data-theme')
      expect(await html.evaluate((el) => getComputedStyle(el).colorScheme)).toBe('dark')
      expect(
        await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe('rgb(16, 16, 13)')
      await expect(page.getByRole('button', { name: /theme/i })).toHaveCount(0)
    })
  }
})

test('fonts are served only from this origin, never Google (NFR-PERF-07)', async ({
  page,
  baseURL,
}) => {
  const fontRequests: string[] = []
  const googleRequests: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) googleRequests.push(url)
    if (request.resourceType() === 'font') fontRequests.push(url)
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  expect(googleRequests).toEqual([])
  expect(fontRequests.length).toBeGreaterThan(0)
  expect(fontRequests.length).toBeLessThanOrEqual(4)
  // Same origin, under /_next/static/ (Vercel serves them from /_next/static/immutable/media/).
  for (const url of fontRequests) {
    expect(new URL(url).origin).toBe(new URL(baseURL ?? '').origin)
    expect(new URL(url).pathname).toMatch(/^\/_next\/static\/(immutable\/)?media\//)
  }
})

test('CV is served as the 03 Nov 2026 PDF (FR-RES-06, D7)', async ({ request }) => {
  const response = await request.get(CV_PATH)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
  expect((await response.body()).byteLength).toBe(72379)
})

test('unknown URLs return a branded, noindex 404 (FR-ERR-01, NFR-SEO-09)', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
  const robots = page.locator('meta[name="robots"]')
  await expect(robots).toHaveCount(1)
  await expect(robots).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
})

test.describe('metadata foundations (ARCHITECTURE §11)', () => {
  test('head tags: canonical, Open Graph text, Twitter summary, icon', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://mohdshahrukh.in',
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Mohd Shahrukh | Software Development Engineer – Frontend',
    )
    // Phase 11: large social card with the build-time preview image.
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    )
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1)
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180')
  })

  test('the social preview image is a 1200×630 PNG with alt text (Phase 11)', async ({
    page,
    request,
  }) => {
    await page.goto('/')
    const og = page.locator('meta[property="og:image"]')
    const url = new URL((await og.getAttribute('content')) ?? '')
    expect(url.origin).toBe('https://mohdshahrukh.in')
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      'Mohd Shahrukh — Software Development Engineer | Frontend',
    )
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      url.toString(),
    )
    // The same image is served by this build (path relative to the test server).
    const image = await request.get(url.pathname + url.search)
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toBe('image/png')
  })

  test('structured data: WebSite and Person, without phone or email (Phase 11)', async ({
    page,
  }) => {
    await page.goto('/')
    const json = await page.locator('script[type="application/ld+json"]').textContent()
    const data = JSON.parse(json ?? '{}') as { '@graph': { '@type': string }[] }
    expect(data['@graph'].map((node) => node['@type'])).toEqual(['WebSite', 'Person'])
    expect(json).toContain('"jobTitle":"Software Development Engineer | Frontend"')
    expect(json).toContain('https://github.com/Srk0o007')
    expect(json).not.toMatch(/telephone|email|mailto|9760787661|khan\.shahrukh156/i)
  })

  test('robots.txt, sitemap.xml and the web manifest are generated', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain('Sitemap: https://mohdshahrukh.in/sitemap.xml')
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).toContain('<loc>https://mohdshahrukh.in/</loc>')
    const manifest = await (await request.get('/manifest.webmanifest')).json()
    expect(manifest.short_name).toBe('Mohd Shahrukh')
    // Phase 11: PNG manifest icons exist at the advertised sizes.
    for (const size of ['192', '512']) {
      const icon = manifest.icons.find((i: { sizes: string }) => i.sizes === `${size}x${size}`)
      expect(icon?.type).toBe('image/png')
      const response = await request.get(icon.src)
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toBe('image/png')
    }
  })
})

test('security headers are sent (ADR 0008)', async ({ request }) => {
  const headers = (await request.get('/')).headers()
  expect(headers['content-security-policy']).toContain("default-src 'self'")
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(headers['content-security-policy']).toContain("form-action 'self' https://formspree.io")
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['x-powered-by']).toBeUndefined()
})

test.describe('without JavaScript (NFR-BRW-03)', () => {
  test.use({ javaScriptEnabled: false })

  test('content renders and the JS flag is absent', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Mohd Shahrukh' })).toBeVisible()
    await expect(page.locator('html')).not.toHaveAttribute('data-js', '')
  })
})
