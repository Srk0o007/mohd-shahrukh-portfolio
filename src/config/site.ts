/**
 * Public, non-secret site configuration (ARCHITECTURE §13, ADR 0006).
 * Nothing in this file is confidential: every value is visible in the rendered HTML.
 */
export const siteConfig = {
  /** Canonical production origin (NFR-SEO-02). */
  url: 'https://mohdshahrukh.in',
  /** Formspree form endpoint (existing form; owner confirms account access before Phase 09). */
  formEndpoint: 'https://formspree.io/f/xleyzgzo',
  /** CV served from /public (FR-RES-06, D7). */
  cvPath: '/Mohd_Shahrukh_Resume_03_Nov_2026.pdf',
  /** localStorage key for the theme preference (ADR 0005). */
  themeStorageKey: 'theme',
} as const
