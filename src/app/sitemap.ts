import type { MetadataRoute } from 'next'
import { siteMeta } from '@/content'

/** NFR-SEO-03 — the single canonical URL; generated at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteMeta.canonicalUrl, lastModified: new Date() }]
}
