import type { MetadataRoute } from 'next'
import { profile, siteMeta } from '@/content'

/** NFR-SEO-07 — PNG icons (192/512) are added in Phase 11 with the apple-icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteMeta.title,
    short_name: profile.name,
    description: siteMeta.description,
    start_url: '/',
    display: 'browser',
    background_color: '#f5f2ea',
    theme_color: '#f5f2ea',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
