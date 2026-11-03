/**
 * First-load JavaScript budget for `/` (NFR-PERF-05, ENGINEERING_GUIDELINES §9).
 * Run after `next build`. Sums the gzip size of every <script src> in the prerendered home page,
 * excluding `noModule` polyfills (never downloaded by the module-capable browsers we support).
 * Fails above the 150 KB budget; warns above the 120 KB target. No dependencies.
 */
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const BUDGET_KB = 150
const TARGET_KB = 120

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
const summary = `First-load JS for /: ${kb.toFixed(1)} KB gzip across ${count} scripts (budget ${BUDGET_KB} KB, target ${TARGET_KB} KB)`
if (kb > BUDGET_KB) {
  console.error(`✗ ${summary}`)
  process.exit(1)
}
console.log(`${kb > TARGET_KB ? '⚠' : '✓'} ${summary}`)
