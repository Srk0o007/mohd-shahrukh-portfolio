import { Fragment, type CSSProperties } from 'react'
import { SkillTabs } from '@/components/skills/SkillTabs'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatCopy, getSectionHeading, skillGroups, uiCopy } from '@/content'
import { cn } from '@/lib/cn'
import { skillCodeLines, skillFileName, splitInTwo, type CodeToken } from '@/lib/skills-code'

const TOKEN_CLASSES: Record<CodeToken['kind'], string> = {
  keyword: 'text-accent',
  name: 'font-bold text-heading',
  string: 'text-accent-3',
  punct: 'text-[#7a7a7a]',
  comment: 'text-faint italic',
  space: '',
}

/**
 * 04 — Skills (FR-RES-03, COMPONENT_VISUAL_SPEC §13, Phase 11.5). Nine groups from the resume,
 * verbatim; no proficiency values (D5). Each group is a tab; its panel shows the group as a
 * TypeScript constant with line numbers and syntax colours (decorative, `aria-hidden`) plus a
 * visually hidden plain list for assistive technology. Below, a two-row ticker of every skill
 * (decorative; pauses on hover; hidden under reduced motion).
 */
export function Skills() {
  const heading = getSectionHeading('skills')
  const headingId = `${heading.id}-heading`
  const allSkills = skillGroups.flatMap((group) => group.skills)
  const meta = formatCopy(uiCopy.skillsMeta, {
    skills: allSkills.length,
    groups: skillGroups.length,
  })
  const tabs = skillGroups.map((group) => ({
    label: group.label,
    count: group.skills.length,
    fileName: skillFileName(group.label),
  }))

  const panels = skillGroups.map((group) => (
    <Fragment key={group.label}>
      <div className="sr-only">
        <h3>{group.label}</h3>
        <ul>
          {group.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        {'context' in group ? <p>{group.context}</p> : null}
      </div>
      <pre
        aria-hidden="true"
        className="m-0 min-h-85 py-5.5 pb-6.5 font-mono text-ui leading-[1.9]"
      >
        <code>
          {skillCodeLines(group).map((line, index) => (
            <span
              key={index}
              style={{ '--i': index } as CSSProperties}
              className="code-line grid grid-cols-[52px_minmax(0,1fr)]"
            >
              <span className="pr-4.5 text-right text-[#3d3d3d] select-none">{index + 1}</span>
              <span className="pr-5 break-words whitespace-pre-wrap">
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={cn(TOKEN_CLASSES[token.kind])}>
                    {token.text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </Fragment>
  ))

  const rows = splitInTwo(allSkills)

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
        className="mb-11"
      />
      <SkillTabs label={uiCopy.skillsTabsLabel} tabs={tabs} meta={meta} panels={panels} />

      <div aria-hidden="true" data-reveal="" className="ticker mt-10 grid gap-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="overflow-hidden">
            <div
              className={cn(
                'flex w-max items-center gap-5.5',
                rowIndex === 0 ? 'ticker-track' : 'ticker-track-reverse',
              )}
            >
              {/* Two copies so the -50 % loop is seamless. */}
              {[...row, ...row].map((skill, index) => (
                <span key={index} className="contents">
                  <span className="ticker-word text-[clamp(20px,2.4vw,30px)] font-bold whitespace-nowrap">
                    {skill}
                  </span>
                  <i className="text-small text-accent not-italic">✦</i>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
