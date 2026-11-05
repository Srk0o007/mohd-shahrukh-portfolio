import { Container } from '@/components/ui/Container'
import { footer, formatCopy } from '@/content'

/**
 * Site footer (FR-FTR-01, COMPONENT_VISUAL_SPEC §23, Phase 11.5): only the copyright line and
 * the credit (owner decision 2026-11-05; the social links live in About and Contact). The year
 * is computed at build time. Bottom padding keeps the text clear of the back-to-top button.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-10 border-t border-line">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2.5 pt-9 pb-[calc(48px+env(safe-area-inset-bottom,0px))] text-small">
        <p data-reveal="">{formatCopy(footer.copyrightTemplate, { year })}</p>
        <p data-reveal="">{footer.credit}</p>
      </Container>
    </footer>
  )
}
