import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ctaBand } from '@/content'

const HEADING_ID = 'hire-heading'

/**
 * Hire CTA band (FR-CTA-01, DS-10, COMPONENT_VISUAL_SPEC §18). Full-bleed accent in both themes
 * with ink content and an ink focus ring; no parallax or motion. "Call Me!" is a tel: link (D19);
 * "Hire Me!" targets #contact, which ships in Phase 09 (tracked by the anchors E2E test).
 */
export function HireCta() {
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="bg-accent py-[calc(var(--space-section)*0.75)] text-on-accent [--color-focus:var(--c-on-accent)]"
    >
      <Container className="xl:gap-x-8 flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <h2 id={HEADING_ID} className="font-display text-h2 font-medium lg:col-span-8">
          {ctaBand.heading}
        </h2>
        <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
          <ButtonLink href={ctaBand.call.href} variant="ink" size="lg">
            {ctaBand.call.label}
          </ButtonLink>
          <ButtonLink href={ctaBand.hire.href} variant="ink-outline" size="lg">
            {ctaBand.hire.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
