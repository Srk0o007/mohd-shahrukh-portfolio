import type { ComponentType } from 'react'
import {
  AccessibilityIcon,
  FlaskConicalIcon,
  MonitorIcon,
  PencilRulerIcon,
  type IconProps,
} from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
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

/**
 * 02 — Services (FR-SRV-01, COMPONENT_VISUAL_SPEC §11, Phase 11.5): 2×2 cards, each icon in a
 * cyan-rimmed rounded square. Copy verbatim from the live site (D20).
 */
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
        className="mb-11"
      />
      <ul data-stagger="" className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {services.map((service) => {
          const Icon = SERVICE_ICONS[service.icon]
          return (
            <Card as="li" key={service.title} className="p-5.5 sm:p-7.5">
              <span className="inline-grid size-13 place-items-center rounded-lg border border-rim bg-accent/8 text-accent">
                <Icon size={24} />
              </span>
              <h3 className="mt-5 text-h3">{service.title}</h3>
              <p className="mt-2.5">{service.description}</p>
            </Card>
          )
        })}
      </ul>
    </Section>
  )
}
