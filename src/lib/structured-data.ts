/**
 * Schema.org structured data (NFR-SEO, Phase 11; owner decision 3): a WebSite and a Person,
 * built only from existing content. Phone and email are deliberately left out, although
 * they are shown on the page. Pure and unit-tested; rendered by `StructuredData`.
 */

export interface StructuredDataInput {
  siteUrl: string
  siteName: string
  name: string
  jobTitle: string
  /** "City, Region, Country", e.g. "Bangalore, Karnataka, India". */
  location: string
  /** Absolute URL of the portrait. */
  imageUrl: string
  /** Public profile URLs (GitHub, LinkedIn). */
  sameAs: readonly string[]
}

const COUNTRY_CODES: Readonly<Record<string, string>> = { India: 'IN' }

export function buildStructuredData(input: StructuredDataInput) {
  const url = input.siteUrl.endsWith('/') ? input.siteUrl : `${input.siteUrl}/`
  const [locality, region, country] = input.location.split(',').map((part) => part.trim())
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: input.siteName,
        inLanguage: 'en',
        publisher: { '@id': `${url}#person` },
      },
      {
        '@type': 'Person',
        '@id': `${url}#person`,
        name: input.name,
        jobTitle: input.jobTitle,
        url,
        image: input.imageUrl,
        sameAs: [...input.sameAs],
        address: {
          '@type': 'PostalAddress',
          ...(locality ? { addressLocality: locality } : {}),
          ...(region ? { addressRegion: region } : {}),
          ...(country ? { addressCountry: COUNTRY_CODES[country] ?? country } : {}),
        },
      },
    ],
  }
}

/** JSON for an inline `<script type="application/ld+json">`: `<` is escaped so content can
 *  never close the script element. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
