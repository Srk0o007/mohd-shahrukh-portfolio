import { cv, formatCopy, navItems, profile, uiCopy } from '@/content'
import { siteAnchor } from '@/lib/links'
import { CvLink } from './CvLink'
import { MobileMenu } from './MobileMenu'
import { PrimaryNav } from './PrimaryNav'

/**
 * Floating glass header (FR-NAV-01, COMPONENT_VISUAL_SPEC §2, Phase 11.5): sticky with a 12 px
 * offset and a 20 px radius; it turns denser with a cyan rim once the page scrolls past 24 px
 * (`data-scrolled`, set by the motion module). Responsive contract:
 * - < 1080 px: wordmark + CV pill (icon only under 560 px) + menu button
 * - ≥ 1080 px: wordmark + inline navigation + CV pill
 * Links use "/#id" so they also work from the 404 page.
 */
export function SiteHeader() {
  const items = navItems.map((item) => ({ label: item.label, href: siteAnchor(item.href) }))
  const cvSuffix = formatCopy(uiCopy.cvAccessibleSuffix, { size: cv.sizeLabel })

  return (
    <header
      id="site-header"
      className="sticky top-[env(safe-area-inset-top,0px)] z-40 pt-3 pr-(--gutter-r) pl-(--gutter)"
    >
      <div className="glass nav-bar mx-auto flex min-h-17 max-w-295 flex-wrap items-center gap-x-4 gap-y-2 rounded-bar py-2.5 pr-3 pl-5.5">
        <a
          href={siteAnchor('#top')}
          className="mr-auto inline-flex min-h-11 items-center text-wordmark font-bold whitespace-nowrap text-heading no-underline max-xs:text-[1.1875rem]"
        >
          {profile.name}
          <span aria-hidden="true" className="text-accent">
            .
          </span>
        </a>
        <PrimaryNav label={uiCopy.primaryNavLabel} items={items} />
        <CvLink href={cv.path} label={cv.label} accessibleSuffix={cvSuffix} compact />
        <MobileMenu
          name={profile.name}
          items={items}
          labels={{ open: uiCopy.menuOpen, close: uiCopy.menuClose, nav: uiCopy.primaryNavLabel }}
        />
      </div>
    </header>
  )
}
