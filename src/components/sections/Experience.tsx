import { CvLink } from '@/components/layout/CvLink'
import { ExperienceEntry } from '@/components/experience/ExperienceEntry'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cv, experience, formatCopy, getSectionHeading, uiCopy } from '@/content'

/**
 * 03 — Experience (FR-RES-01/02/06, Phase 11.5): a timeline with a cyan gradient line and
 * glowing nodes; three roles newest first, highlights verbatim from the 03 Nov 2026 resume.
 * The CV download is repeated here as the in-content location (FR-RES-06).
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
        className="mb-11"
      />
      <div className="relative">
        <span
          aria-hidden="true"
          className="timeline-line absolute top-1.5 bottom-1.5 left-1.25 w-px mid:left-[206px]"
        />
        <ol className="relative grid gap-5.5">
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
        </ol>
      </div>
      <p data-reveal="" className="mt-10 flex justify-center">
        <CvLink
          href={cv.path}
          label={cv.label}
          accessibleSuffix={formatCopy(uiCopy.cvAccessibleSuffix, { size: cv.sizeLabel })}
          variant="ghost"
          size="lg"
        />
      </p>
    </Section>
  )
}
