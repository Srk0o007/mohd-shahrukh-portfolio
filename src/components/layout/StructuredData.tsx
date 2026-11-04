import { siteConfig } from '@/config/site'
import { profile, socialLinks } from '@/content'
import { buildStructuredData, serializeJsonLd } from '@/lib/structured-data'

/**
 * JSON-LD for the home page (Phase 11, owner decision 3). A data block, not executable script,
 * so CSP `script-src` does not apply. The second of the two reviewed `dangerouslySetInnerHTML`
 * uses (ENGINEERING_GUIDELINES §3, ADR 0008): typed content only, and `serializeJsonLd` escapes "<".
 */
export function StructuredData() {
  const data = buildStructuredData({
    siteUrl: siteConfig.url,
    siteName: profile.name,
    name: profile.name,
    jobTitle: profile.title,
    location: profile.location,
    imageUrl: new URL(profile.portrait.src.src, siteConfig.url).toString(),
    sameAs: socialLinks.filter((link) => link.href.startsWith('https://')).map((link) => link.href),
  })
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
