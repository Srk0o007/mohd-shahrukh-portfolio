import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { certifications, getSectionHeading } from '@/content'

/**
 * 05 — Certifications (FR-RES-04, D3, Phase 11.5): three cards with name and issuer;
 * no invented dates or credential URLs.
 */
export function Certifications() {
  const heading = getSectionHeading('certifications')
  const headingId = `${heading.id}-heading`

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
        className="mb-11"
      />
      <ul data-stagger="" className="grid grid-cols-1 gap-5 sm:grid-cols-2 mid:grid-cols-3">
        {certifications.map((cert) => (
          <Card as="li" key={cert.name} className="grid content-start gap-2.5 p-5.5 sm:p-6.5">
            <h3 className="text-[1.3125rem] leading-[1.3]">{cert.name}</h3>
            <p>
              <span className="block">{cert.issuer}</span>
              {'credentialType' in cert ? (
                <span className="block">{cert.credentialType}</span>
              ) : null}
            </p>
          </Card>
        ))}
      </ul>
    </Section>
  )
}
