import type { ComponentType } from 'react'
import {
  AccessibilityIcon,
  FlaskConicalIcon,
  MonitorIcon,
  PencilRulerIcon,
  type IconProps,
} from '@/components/ui/icons'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSectionHeading, services, type ServiceIcon } from '@/content'

/**
 * Content icon keys → visual icons. The content key stays `flask` (approved schema);
 * only its visual mapping uses Lucide's `flask-conical` (owner condition C, 2026-11-04).
 */
const SERVICE_ICONS: Record<ServiceIcon, ComponentType<IconProps>> = {
  monitor: MonitorIcon,
  'pen-ruler': PencilRulerIcon,
  accessibility: AccessibilityIcon,
  flask: FlaskConicalIcon,
}

/** 02 — Services (FR-SRV-01, COMPONENT_VISUAL_SPEC §11). Copy verbatim from the live site (D20). */
export function Services() {
  const heading = getSectionHeading('services')
  const headingId = `${heading.id}-heading`

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
      />
      <div className="xl:gap-x-8 mt-12 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:col-span-9 lg:col-start-4">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.icon]
            return (
              <li key={service.title} className="border-rule border-t pt-6">
                <Icon size={24} />
                <h3 className="font-display mt-4 text-h3 font-medium">{service.title}</h3>
                <p className="text-text-muted mt-3 max-w-[48ch]">{service.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
