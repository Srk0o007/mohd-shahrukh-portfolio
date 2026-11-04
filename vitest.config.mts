import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/** Unit + component tests (ADR 0007). E2E and accessibility specs run in Playwright. */
export default defineConfig({
  plugins: [staticImagePlugin(), react()],
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

/**
 * Resolve static image imports to the shape Next.js produces (`StaticImageData`: src, width,
 * height), read from the file header. Without this they are plain URL strings, and
 * size-dependent logic (DS-08 image fit) and intrinsic dimensions could not be tested.
 */
function staticImagePlugin(): Plugin {
  return {
    name: 'test-static-image',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0] ?? id
      if (!/\.(png|jpe?g)$/i.test(file)) return null
      const { width, height } = imageSize(readFileSync(file))
      const src = `/${file.split(/[\\/]/).pop() ?? ''}`
      return `export default ${JSON.stringify({ src, width, height })}`
    },
  }
}

function imageSize(bytes: Buffer): { width: number; height: number } {
  // PNG: IHDR width/height at bytes 16–23.
  if (bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  }
  // JPEG: walk segments to the first SOF0–SOF3 marker.
  let offset = 2
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = bytes[offset + 1] ?? 0
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) }
    }
    offset += 2 + bytes.readUInt16BE(offset + 2)
  }
  throw new Error('Unsupported image format')
}
