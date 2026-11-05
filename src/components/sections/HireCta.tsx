import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { ctaBand } from '@/content'

const HEADING_ID = 'hire-heading'

/**
 * Hire band (FR-CTA-01, DS-10, COMPONENT_VISUAL_SPEC §18, Phase 11.5): a card with a faint
 * cyan radial glow (parallax) and two CTAs. "Call Me!" is a tel: link (D19); "Hire Me!" targets
 * #contact.
 */
export function HireCta() {
  return (
    <section aria-labelledby={HEADING_ID} className="py-7.5">
      <Container>
        <Card
          hover={false}
          className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 overflow-hidden rounded-panel p-[clamp(36px,5vw,64px)]"
        >
          <div
            aria-hidden="true"
            data-speed="0.15"
            className="hire-glow pointer-events-none absolute -top-75 -right-40 size-130 rounded-full"
          />
          <h2 id={HEADING_ID} className="relative max-w-[16ch] text-hire">
            {ctaBand.heading}
          </h2>
          <div className="relative flex flex-wrap gap-3.5">
            <ButtonLink href={ctaBand.call.href} size="lg">
              {ctaBand.call.label}
            </ButtonLink>
            <ButtonLink href={ctaBand.hire.href} variant="ghost" size="lg">
              {ctaBand.hire.label}
            </ButtonLink>
          </div>
        </Card>
      </Container>
    </section>
  )
}
