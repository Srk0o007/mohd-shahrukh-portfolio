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
  // One worker locally keeps runs reliable on memory-constrained machines; CI runners have
  // room for two (three engines since Phase 11).
  workers: isCI ? 2 : 1,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  // Phase 11 (owner decision 4): the full suite runs in all three engines on every PR.
  // WebKit needs the CSP harness in tests/fixtures.ts on plain-HTTP localhost.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})
