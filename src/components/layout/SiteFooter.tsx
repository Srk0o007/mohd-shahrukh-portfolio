import { Container } from '@/components/ui/Container'
import { footer, formatCopy, socialLinks, uiCopy } from '@/content'
import { SocialLinks } from './SocialLinks'

/**
 * Site footer (FR-FTR-01, COMPONENT_VISUAL_SPEC §23). The year is computed at build time.
 * From 768 px the social links sit at the right edge, under the fixed back-to-top button
 * when scrolled to the end; the larger bottom padding keeps them clear of it (Phase 10).
 */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-rule border-t">
      <Container className="text-text-muted flex flex-col gap-6 pt-12 pb-10 text-small md:flex-row md:flex-wrap md:items-center md:justify-between md:pb-24">
        <p>{formatCopy(footer.copyrightTemplate, { year })}</p>
        <p>{footer.credit}</p>
        <SocialLinks links={socialLinks} newTabLabel={uiCopy.newTab} className="text-text" />
      </Container>
    </footer>
  )
}
