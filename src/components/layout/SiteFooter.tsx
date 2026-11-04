import { Container } from '@/components/ui/Container'
import { footer, formatCopy, socialLinks, uiCopy } from '@/content'
import { SocialLinks } from './SocialLinks'

/** Site footer (FR-FTR-01, COMPONENT_VISUAL_SPEC §23). The year is computed at build time. */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-rule">
      <Container className="flex flex-col gap-6 pt-12 pb-10 text-small text-text-muted md:flex-row md:flex-wrap md:items-center md:justify-between">
        <p>{formatCopy(footer.copyrightTemplate, { year })}</p>
        <p>{footer.credit}</p>
        <SocialLinks links={socialLinks} newTabLabel={uiCopy.newTab} className="text-text" />
      </Container>
    </footer>
  )
}
