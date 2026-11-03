import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/** Unit + component tests (ADR 0007). E2E and accessibility specs run in Playwright. */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    // A small, fixed worker pool keeps runs reliable on memory-constrained machines
    // (one worker per CPU exhausted memory locally); ample for this suite's size.
    maxWorkers: 2,
  },
})
