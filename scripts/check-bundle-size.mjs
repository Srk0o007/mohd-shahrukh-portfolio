/**
 * First-load JavaScript budget for `/` (NFR-PERF-05, ENGINEERING_GUIDELINES §9).
 * Run after `next build`. Sums the gzip size of every <script src> in the prerendered home page,
 * excluding `noModule` polyfills (never downloaded by the module-capable browsers we support).
 *
 * - Fails above the 150 KB budget.
 * - Warns when this project's own code exceeds 15 KB above the framework baseline (owner
 *   decision, Phase 11, replacing the unreachable 120 KB target). The baseline is the
 *   first-load JS of the Phase 06 shell with no client components (Next.js 16.4.5 /
 *   React 19.3): re-measure it whenever Next.js or React is upgraded.
 * No dependencies.
 */
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const BUDGET_KB = 150
const FRAMEWORK_BASELINE_KB = 136.9
const APP_ALLOWANCE_KB = 15

const html = readFileSync('.next/server/app/index.html', 'utf8')
const tags = html.match(/<script[^>]*\ssrc="\/_next\/static\/[^"]+\.js"[^>]*>/g) ?? []

let gzipBytes = 0
let count = 0
for (const tag of tags) {
  if (/\snoModule/i.test(tag)) continue
  const src = /src="\/_next\/(static\/[^"]+\.js)"/.exec(tag)?.[1]
  if (!src) continue
  gzipBytes += gzipSync(readFileSync(`.next/${src}`), { level: 9 }).length
  count += 1
}

const kb = gzipBytes / 1024
const app = kb - FRAMEWORK_BASELINE_KB
const summary =
  `First-load JS for /: ${kb.toFixed(1)} KB gzip across ${count} scripts (budget ${BUDGET_KB} KB); ` +
  `project code ≈ ${app.toFixed(1)} KB above the ${FRAMEWORK_BASELINE_KB} KB framework baseline ` +
  `(allowance ${APP_ALLOWANCE_KB} KB)`
if (kb > BUDGET_KB) {
  console.error(`✗ ${summary}`)
  process.exit(1)
}
console.log(`${app > APP_ALLOWANCE_KB ? '⚠' : '✓'} ${summary}`)
