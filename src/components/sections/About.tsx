import { SocialLinks } from '@/components/layout/SocialLinks'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSectionHeading, profile, socialLinks, uiCopy } from '@/content'

/**
 * 01 — About (FR-ABT-01, COMPONENT_VISUAL_SPEC §10, DS-20).
 * Summary verbatim from the 03 Nov 2026 resume; key facts use existing profile fields only;
 * GitHub and LinkedIn as text links (owner decision, 2026-11-04). No availability statement (D1, D13).
 */
export function About() {
  const heading = getSectionHeading('about')
  const headingId = `${heading.id}-heading`
  const facts = [
    { term: uiCopy.factRole, value: profile.title },
    { term: uiCopy.factLocation, value: profile.location },
    { term: uiCopy.factExperience, value: `${profile.yearsOfExperience} ${uiCopy.statLabel}` },
  ]
  const profileLinks = socialLinks.filter((link) => link.id === 'github' || link.id === 'linkedin')

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
        intro={<p>{profile.summary}</p>}
      />
      <div className="xl:gap-x-8 mt-12 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-9 lg:col-start-4">
          <dl className="border-rule grid border-t md:grid-cols-3">
            {facts.map((fact) => (
              <div
                key={fact.term}
                className="border-rule border-b py-4 md:border-b-0 md:pr-6 md:not-first:border-l md:not-first:pl-6"
              >
                <dt className="text-text-muted text-label font-medium uppercase">{fact.term}</dt>
                <dd className="mt-2 font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <SocialLinks links={profileLinks} newTabLabel={uiCopy.newTab} className="mt-8" />
        </div>
      </div>
    </Section>
  )
}
