import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSectionHeading, skillGroups } from '@/content'

/**
 * 04 — Skills (FR-RES-03, COMPONENT_VISUAL_SPEC §13). Nine groups from the resume, verbatim;
 * no proficiency values (D5). Visual " · " separators are hidden from assistive technology.
 */
export function Skills() {
  const heading = getSectionHeading('skills')
  const headingId = `${heading.id}-heading`

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
      />
      <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <li key={group.label} className="border-rule border-t pt-6">
            <h3 className="text-text-muted text-label font-medium uppercase">{group.label}</h3>
            <ul className="mt-3">
              {group.skills.map((skill, index) => (
                <li key={skill} className="inline">
                  {skill}
                  {index < group.skills.length - 1 ? (
                    <span aria-hidden="true" className="text-text-muted">
                      {' · '}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            {'context' in group ? (
              <p className="text-text-muted mt-2 text-small">{group.context}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  )
}
