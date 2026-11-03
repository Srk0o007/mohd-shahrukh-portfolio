import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

/** NFR-SEO-03 — generated at build time. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
