/**
 * In-page navigation helpers (FR-NAV-02/05/06, FR-INT-05). DOM-only, framework-free.
 * Scrolling uses the document's CSS `scroll-behavior` (smooth, or instant under reduced
 * motion) and the content `scroll-margin-top` (globals.css), so headings land below the sticky
 * header.
 */

/** Legacy anchors from the previous site → current section ids (FR-NAV-06). */
export const LEGACY_ANCHORS: Readonly<Record<string, string>> = {
  home: 'top',
  resume: 'experience',
  portfolio: 'projects',
  testimonial: 'testimonials',
}

export function legacyTarget(hash: string): string | null {
  const id = hash.replace(/^#/, '')
  return LEGACY_ANCHORS[id] ?? null
}

/**
 * Scroll to a section, focus it (sections are `tabindex="-1"`) and update the URL hash.
 * `replace` rewrites the current history entry (used for legacy-anchor redirects).
 * Returns false when the section is not on this page.
 */
export function goToSection(id: string, options: { replace?: boolean } = {}): boolean {
  const target = document.getElementById(id)
  if (!target) return false
  const url = `#${id}`
  if (options.replace) window.history.replaceState(null, '', url)
  else if (window.location.hash !== url) window.history.pushState(null, '', url)
  target.scrollIntoView({ block: 'start' })
  target.focus({ preventScroll: true })
  return true
}

/**
 * The section currently being read: the last section whose top has passed the reading line
 * (40% down the viewport), or the last section once the page is scrolled to the bottom.
 */
export function currentSectionId(
  sections: readonly { id: string; top: number }[],
  viewport: { height: number; atBottom: boolean },
): string | null {
  if (sections.length === 0) return null
  if (viewport.atBottom) return sections[sections.length - 1]?.id ?? null
  const line = viewport.height * 0.4
  let current: string | null = null
  for (const section of sections) {
    if (section.top <= line) current = section.id
  }
  return current
}
