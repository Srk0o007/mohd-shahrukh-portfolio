import type { UiCopy } from './types'

/**
 * CONTENT_SCHEMA §13 — functional interface copy (no personal claims).
 * errorHeading/errorText/errorRetry were added in Phase 06 for the error boundaries.
 */
export const uiCopy = {
  skipLink: 'Skip to main content',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  themeToDark: 'Switch to dark theme',
  themeToLight: 'Switch to light theme',
  cvAccessibleSuffix: '(PDF, {size})',
  newTab: '(opens in new tab)',
  filterAll: 'All',
  filterEnterprise: 'Enterprise products',
  filterWebsites: 'Websites',
  filterStatus: 'Showing {n} of {total} projects',
  projectLink: 'Visit {title} website',
  projectInternalNote: 'Internal product — no public link',
  required: '(required)',
  errName: 'Please enter your name.',
  errEmail: 'Please enter a valid email address.',
  errMessage: 'Please enter a message.',
  errTooLong: 'Please shorten this to {max} characters or fewer.',
  sending: 'Sending…',
  sendSuccess: 'Thank you! Your message has been sent.',
  sendError:
    "Sorry, your message couldn't be sent. Please try again or email khan.shahrukh156@gmail.com.",
  backToTop: 'Back to top',
  highlightsMore: 'Show all {n} highlights',
  highlightsLess: 'Show fewer highlights',
  marqueePause: 'Pause animation',
  marqueePlay: 'Play animation',
  notFoundHeading: 'Page not found',
  notFoundText: "The page you're looking for doesn't exist.",
  notFoundLink: 'Back to home',
  errorHeading: 'Something went wrong',
  errorText: 'This page could not be displayed. Please try again.',
  errorRetry: 'Try again',
  statLabel: 'Years of Experience',
  // Phase 07 — approved by the owner on 2026-11-04 (neutral interface labels).
  heroEyebrow: 'Portfolio',
  factRole: 'Role',
  factLocation: 'Based in',
  factExperience: 'Experience',
  primaryNavLabel: 'Primary',
  // Wording from the 03 Nov 2026 resume ("Graduated 2019").
  graduated: 'Graduated {year}',
  // Phase 08 — category tag labels from DATA_MODEL §4 (`ProjectView.groupLabel`, DS-09).
  tagEnterprise: 'Enterprise product',
  tagWebsite: 'Website',
} as const satisfies UiCopy

/** Replaces `{key}` placeholders in UI copy. */
export function formatCopy(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}
