import { test as base, expect, type BrowserContext } from '@playwright/test'

// Everything else (types such as Page, Route, ConsoleMessage) passes through unchanged;
// the local `test` and `expect` below take precedence over these.
export * from '@playwright/test'

/**
 * Shared Playwright fixtures (Phase 11).
 *
 * WebKit harness: the site's CSP includes `upgrade-insecure-requests`. Over the plain-HTTP
 * localhost test server, WebKit (unlike Chromium and Firefox) rewrites every subresource to
 * https://localhost, so no CSS, fonts or images load. Production is HTTPS, where the directive
 * changes nothing. For WebKit only, the harness removes that single directive from the
 * document's CSP header; every other directive and header is left untouched.
 * See docs/quality/ACCESSIBILITY_REPORT.md §2.
 */
export async function applyWebKitHarness(context: BrowserContext, browserName: string) {
  if (browserName !== 'webkit') return
  await context.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue()
    const response = await route.fetch()
    const headers = { ...response.headers() }
    const csp = headers['content-security-policy']
    if (csp) headers['content-security-policy'] = csp.replace(/;\s*upgrade-insecure-requests/, '')
    await route.fulfill({ response, headers })
  })
}

/**
 * WebKit keyboard model: like Safari with default settings, Tab skips links (Safari only
 * includes them with "Press Tab to highlight each item"), and clicking a button does not focus
 * it. Tab-order walks over links are therefore Chromium/Firefox-only; focus-retention checks
 * activate controls by keyboard, which is the behaviour the requirements describe.
 */
export const WEBKIT_TAB_SKIPS_LINKS =
  'WebKit (Safari default) skips links on Tab; link tab order is verified in Chromium and Firefox, and on real Safari in Phase 12'

// The fixture callback is Playwright's, not a React hook (hence not named `use`).
export const test = base.extend({
  context: async ({ context, browserName }, provide) => {
    await applyWebKitHarness(context, browserName)
    await provide(context)
    await context.unrouteAll({ behavior: 'ignoreErrors' })
  },
})

export { expect }
