import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Helpers for build-time images rendered with `next/og` (social preview, Apple and manifest
 * icons; Phase 11). Everything here runs during `next build` only — the outputs are static PNGs.
 */

/** Phase 11.5 tokens (COLOR_TOKENS.md, ADR 0014): dark only. */
export const BRAND = {
  frame: '#000000',
  heading: '#ffffff',
  sub: '#969696',
  line: '#1f1f1f',
  accent: '#00c2ff',
  accent2: '#0077ff',
  onAccent: '#00131c',
} as const

/**
 * A Google font as TrueType for Satori (which cannot read WOFF2), subset to `text`.
 * Fetched at build time, like next/font; the browser never contacts Google.
 */
export async function loadGoogleFont(family: string, weight: number, text: string) {
  const query = `family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text()
  const url = /src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1]
  if (!url) throw new Error(`Font not found: ${family} ${weight}`)
  return (await fetch(url)).arrayBuffer()
}

/** The "MS" monogram favicon (src/app/icon.svg) as a data URI for <img> in Satori. */
export async function monogramDataUri(): Promise<string> {
  const svg = await readFile(join(process.cwd(), 'src/app/icon.svg'))
  return `data:image/svg+xml;base64,${svg.toString('base64')}`
}

/** A square PNG of the monogram filling the canvas (black background is part of the SVG). */
export async function monogramElement(size: number) {
  const src = await monogramDataUri()
  // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only
  return <img src={src} width={size} height={size} alt="" />
}
