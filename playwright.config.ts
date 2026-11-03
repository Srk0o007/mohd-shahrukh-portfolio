import { defineConfig, devices } from '@playwright/test'

/**
 * E2E + accessibility (ADR 0007). Runs against a production build:
 * `npm run build` first, then `npm run test:e2e` (CI does both).
 */
const PORT = 3100
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'a11y/**/*.spec.ts'],
  // One worker keeps runs reliable on memory-constrained machines; the suite is small.
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  // Chromium on every PR; Firefox and WebKit join the matrix before release (Phase 11).
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})
