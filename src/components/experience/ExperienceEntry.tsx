import type { Experience } from '@/content'
import { formatYearMonth } from '@/lib/dates'
import { HighlightsDisclosure } from './HighlightsDisclosure'

/**
 * One role (FR-RES-01, COMPONENT_VISUAL_SPEC §12): dates in <time>, company (+ note), role,
 * tagline and highlights. ≥ 1024 px: dates in columns 1–3, content in 4–12; stacked below.
 */
export interface ExperienceEntryProps {
  role: Experience
  /** Formatted disclosure labels (content stays in the section; this component gets props). */
  labels: { more: string; less: string }
}

export function ExperienceEntry({ role, labels }: ExperienceEntryProps) {
  return (
    <article className="grid gap-x-6 gap-y-3 border-t border-rule py-8 lg:grid-cols-12 xl:gap-x-8">
      <p className="text-ui font-medium tabular-nums lg:col-span-3">
        <time dateTime={role.start}>{formatYearMonth(role.start)}</time> –{' '}
        <time dateTime={role.end}>{formatYearMonth(role.end)}</time>
        <span aria-hidden="true" className="text-text-muted lg:hidden">
          {' · '}
        </span>
        <span className="text-text-muted lg:mt-1 lg:block lg:text-small lg:font-normal">
          {role.location}
        </span>
      </p>
      <div className="lg:col-span-9">
        <h3 className="font-display text-h3-lg font-medium">
          {role.company}
          {role.companyNote ? (
            <span className="font-normal text-text-muted"> ({role.companyNote})</span>
          ) : null}
        </h3>
        <p className="mt-1.5 text-text-muted">{role.role}</p>
        {role.tagline ? <p className="mt-1 text-small text-text-muted">{role.tagline}</p> : null}
        <div className="mt-5">
          <HighlightsDisclosure highlights={role.highlights} labels={labels} />
        </div>
      </div>
    </article>
  )
}
