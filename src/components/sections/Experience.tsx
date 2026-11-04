import { CvLink } from '@/components/layout/CvLink'
import { ExperienceEntry } from '@/components/experience/ExperienceEntry'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cv, experience, formatCopy, getSectionHeading, uiCopy } from '@/content'

/**
 * 03 — Experience (FR-RES-01/02/06). Three roles newest first, highlights verbatim from the
 * 03 Nov 2026 resume; the CV download is repeated here as the in-content location (FR-RES-06).
 */
export function Experience() {
  const heading = getSectionHeading('experience')
  const headingId = `${heading.id}-heading`

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
      />
      <div className="mt-12">
        {experience.map((role) => (
          <ExperienceEntry
            key={role.id}
            role={role}
            labels={{
              more: formatCopy(uiCopy.highlightsMore, { n: role.highlights.length }),
              less: uiCopy.highlightsLess,
            }}
          />
        ))}
      </div>
      <div className="border-rule xl:gap-x-8 border-t pt-8 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-9 lg:col-start-4">
          <CvLink
            href={cv.path}
            label={cv.label}
            accessibleSuffix={formatCopy(uiCopy.cvAccessibleSuffix, { size: cv.sizeLabel })}
            variant="secondary"
          />
        </div>
      </div>
    </Section>
  )
}
