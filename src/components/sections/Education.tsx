import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { education, getSectionHeading } from '@/content'
import { cn } from '@/lib/cn'

/**
 * 06 — Education (FR-RES-05, COMPONENT_VISUAL_SPEC §14, Phase 11.5): a journey timeline. A centre
 * line fills with a cyan gradient as the section moves through the viewport (`--progress`, set
 * by the motion module) and each milestone node lights up as the fill reaches it (`data-lit`).
 * Cards alternate left and right; below 960 px a single column with the line on the left.
 * Without JavaScript, or under reduced motion, the line is drawn in full and every node is lit.
 * Three entries verbatim from the live site (owner decision 2026-11-05).
 */
export function Education() {
  const heading = getSectionHeading('education')
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
      <div data-journey="" className="journey relative py-2.5">
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-2.25 -ml-px w-0.5 rounded-[2px] bg-[rgb(255_255_255/0.07)] mid:left-1/2"
        >
          <span className="journey-fill absolute inset-x-0 top-0 rounded-[2px]" />
        </span>
        <ol className="relative grid gap-8.5">
          {education.map((entry, index) => (
            <li
              key={entry.degree}
              className="relative grid grid-cols-1 pl-10 mid:grid-cols-2 mid:gap-x-18 mid:pl-0"
            >
              <span
                aria-hidden="true"
                className="journey-node absolute top-8.5 left-2.25 z-1 -ml-2.25 size-4.5 rounded-full border-2 border-[#3a3a3a] bg-frame mid:left-1/2"
              />
              <Card
                as="article"
                className={cn(
                  'ed-card overflow-hidden p-5.5 sm:px-7.5 sm:py-7',
                  index % 2 === 0 ? 'mid:col-start-1' : 'mid:col-start-2',
                )}
              >
                <p className="font-bold tracking-[0.06em] text-accent tabular-nums">
                  <time dateTime={String(entry.from)}>{entry.from}</time> –{' '}
                  <time dateTime={String(entry.to)}>{entry.to}</time>
                </p>
                <h3 className="relative mt-2 text-h3">{entry.degree}</h3>
                <p className="relative mt-1.5">{entry.institution}</p>
                <span
                  aria-hidden="true"
                  className="ghost-year pointer-events-none absolute -right-1.5 -bottom-5.5 text-[6rem] leading-none font-bold"
                >
                  {entry.to}
                </span>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
