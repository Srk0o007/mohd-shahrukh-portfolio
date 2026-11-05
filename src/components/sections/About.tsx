import { SocialLinks } from '@/components/layout/SocialLinks'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSectionHeading, profile, socialLinks, uiCopy } from '@/content'

/**
 * 01 — About (FR-ABT-01, COMPONENT_VISUAL_SPEC §10, Phase 11.5): the summary and the GitHub /
 * LinkedIn text links on the left, a facts card (Role / Based in / Experience) on the right.
 * Summary verbatim from the 03 Nov 2026 resume; no availability statement (D1, D13).
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
      <div className="grid grid-cols-1 items-center gap-12 mid:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
        <div>
          <SectionHeader
            index={heading.index}
            eyebrow={heading.eyebrow}
            heading={heading.heading}
            headingId={headingId}
            className="mb-11"
          />
          <p data-reveal="" className="on-wave max-w-[62ch] text-lead">
            {profile.summary}
          </p>
          <div data-reveal="">
            <SocialLinks links={profileLinks} newTabLabel={uiCopy.newTab} className="mt-6.5" />
          </div>
        </div>
        <Card as="dl" className="px-7 py-2.5">
          {facts.map((fact) => (
            <div key={fact.term} className="border-b border-line py-5 last:border-b-0">
              <dt className="text-xs font-bold tracking-[0.16em] text-accent uppercase">
                {fact.term}
              </dt>
              <dd className="mt-1.5 text-h3-sm font-bold text-heading">{fact.value}</dd>
            </div>
          ))}
        </Card>
      </div>
    </Section>
  )
}
