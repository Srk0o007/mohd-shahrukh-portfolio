import { describe, expect, it } from 'vitest'
import { buildStructuredData, serializeJsonLd } from './structured-data'

const input = {
  siteUrl: 'https://mohdshahrukh.in',
  siteName: 'Mohd Shahrukh',
  name: 'Mohd Shahrukh',
  jobTitle: 'Software Development Engineer | Frontend',
  location: 'Bangalore, Karnataka, India',
  imageUrl: 'https://mohdshahrukh.in/_next/static/media/headshot.png',
  sameAs: ['https://github.com/Srk0o007', 'https://www.linkedin.com/in/x/'],
}

describe('buildStructuredData', () => {
  const data = buildStructuredData(input)
  const [site, person] = data['@graph']

  it('describes the WebSite with a stable id and canonical URL', () => {
    expect(data['@context']).toBe('https://schema.org')
    expect(site).toMatchObject({
      '@type': 'WebSite',
      '@id': 'https://mohdshahrukh.in/#website',
      url: 'https://mohdshahrukh.in/',
      inLanguage: 'en',
      publisher: { '@id': 'https://mohdshahrukh.in/#person' },
    })
  })

  it('describes the Person from content, with the city split into an address', () => {
    expect(person).toMatchObject({
      '@type': 'Person',
      name: 'Mohd Shahrukh',
      jobTitle: 'Software Development Engineer | Frontend',
      url: 'https://mohdshahrukh.in/',
      sameAs: input.sameAs,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bangalore',
        addressRegion: 'Karnataka',
        addressCountry: 'IN',
      },
    })
  })

  it('never includes phone or email (owner decision)', () => {
    const json = JSON.stringify(data)
    expect(json).not.toMatch(/telephone|email|mailto|tel:/i)
  })
})

describe('serializeJsonLd', () => {
  it('escapes "<" so the payload cannot close the script element', () => {
    const out = serializeJsonLd({ text: '</script><script>alert(1)</script>' })
    expect(out).not.toContain('</script>')
    expect(JSON.parse(out)).toEqual({ text: '</script><script>alert(1)</script>' })
  })
})
