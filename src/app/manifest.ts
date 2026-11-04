import type { MetadataRoute } from 'next'
import { profile, siteMeta } from '@/content'

/** NFR-SEO-07 — SVG favicon plus 192/512 PNG icons (Phase 11, generated at build time). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMeta.title,
    short_name: profile.name,
    description: siteMeta.description,
    start_url: '/',
    display: 'browser',
    background_color: '#10100d',
    theme_color: '#10100d',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/192', sizes: '192x192', type: 'image/png' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png' },
    ],
  }
}
