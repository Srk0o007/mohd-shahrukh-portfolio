import type { ReactNode } from 'react'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSectionHeading, type SectionId } from '@/content'

/** Table-like credential row (COMPONENT_VISUAL_SPEC §14): name 4–9, detail 10–12 at ≥ 1024. */
export function CredentialRow({ title, detail }: { title: ReactNode; detail: ReactNode }) {
  return (
    <li className="border-rule xl:gap-x-8 grid gap-x-6 gap-y-1 border-t py-6 md:grid-cols-12">
      <div className="md:col-span-8 lg:col-span-6 lg:col-start-4">{title}</div>
      <div className="text-text-muted text-small md:col-span-4 md:text-right lg:col-span-3">
        {detail}
      </div>
    </li>
  )
}

/** Numbered section holding a list of credential rows (05 Certifications, 06 Education). */
export function CredentialSection({ id, children }: { id: SectionId; children: ReactNode }) {
  const heading = getSectionHeading(id)
  const headingId = `${heading.id}-heading`
  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
      />
      <ul className="border-rule mt-12 border-b">{children}</ul>
    </Section>
  )
}
