import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

/** Form endpoint origin allowed by the CSP (ADR 0006). */
const FORM_ORIGIN = 'https://formspree.io'

/**
 * Content Security Policy for statically rendered pages (ADR 0008).
 * `'unsafe-inline'` scripts are required by the App Router's inline bootstrap scripts and the
 * pre-paint theme script; a hash-source replacement is evaluated in Phase 11.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${FORM_ORIGIN}`,
  `form-action 'self' ${FORM_ORIGIN}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `next dev` would otherwise write an AGENTS.md file into the repository root; the project's
  // own docs (docs/architecture) are the source of guidance, so the generated file is disabled.
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
