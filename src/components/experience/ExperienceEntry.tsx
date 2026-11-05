import { Card } from '@/components/ui/Card'
import type { Experience } from '@/content'
import { formatYearMonth } from '@/lib/dates'
import { HighlightsDisclosure } from './HighlightsDisclosure'

/**
 * One role on the timeline (FR-RES-01, COMPONENT_VISUAL_SPEC §12, Phase 11.5): dates in <time>
 * and the location on the left with a glowing node on the line; the card on the right with
 * company (+ note), role, tagline and highlights. Stacked below 960 px, line on the left.
 */
export interface ExperienceEntryProps {
  role: Experience
  /** Formatted disclosure labels (content stays in the section; this component gets props). */
  labels: { more: string; less: string }
}

export function ExperienceEntry({ role, labels }: ExperienceEntryProps) {
  return (
    <li className="grid grid-cols-1 gap-2.5 pl-7 mid:grid-cols-[190px_minmax(0,1fr)] mid:gap-9 mid:pl-0">
      <p data-reveal="" className="relative font-bold text-heading tabular-nums mid:pt-6.5">
        <span
          aria-hidden="true"
          className="timeline-node absolute top-1.75 -left-7 size-2.75 rounded-full border-2 border-accent bg-bg mid:top-8.5 mid:right-[-24px] mid:left-auto"
        />
        <time dateTime={role.start}>{formatYearMonth(role.start)}</time> –{' '}
        <time dateTime={role.end}>{formatYearMonth(role.end)}</time>
        <span className="block text-small font-normal text-sub">{role.location}</span>
      </p>
      <Card as="article" className="p-5.5 sm:px-7.5 sm:py-7">
        <h3 className="text-h3-lg">
          {role.company}
          {role.companyNote ? (
            <span className="font-normal text-sub"> ({role.companyNote})</span>
          ) : null}
        </h3>
        <p className="mt-1 font-bold text-accent">{role.role}</p>
        {role.tagline ? <p className="text-small">{role.tagline}</p> : null}
        <HighlightsDisclosure highlights={role.highlights} labels={labels} />
      </Card>
    </li>
  )
}
