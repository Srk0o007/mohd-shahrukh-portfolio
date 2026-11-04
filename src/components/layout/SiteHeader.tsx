import { Container } from '@/components/ui/Container'
import { cv, formatCopy, navItems, profile, socialLinks, uiCopy } from '@/content'
import { siteAnchor } from '@/lib/links'
import { CvLink } from './CvLink'
import { MobileMenu } from './MobileMenu'
import { PrimaryNav } from './PrimaryNav'
import { SocialLinks } from './SocialLinks'

/**
 * Sticky site header (FR-NAV-01, COMPONENT_VISUAL_SPEC §2). Responsive contract:
 * - < 768 px: wordmark + menu button (CV link inside the menu)
 * - 768–1279 px: wordmark + CV link + menu button
 * - ≥ 1280 px: wordmark + inline navigation + CV link
 * The theme toggle arrives in Phase 09. Links use "/#id" so they also work from the 404 page.
 */
export function SiteHeader() {
  const items = navItems.map((item) => ({ label: item.label, href: siteAnchor(item.href) }))
  const cvSuffix = formatCopy(uiCopy.cvAccessibleSuffix, { size: cv.sizeLabel })

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg">
      <Container className="flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 py-2.5 md:min-h-18">
        <a
          href={siteAnchor('#top')}
          className="mr-auto font-display text-wordmark font-semibold no-underline"
        >
          {profile.name}
        </a>
        <PrimaryNav label={uiCopy.primaryNavLabel} items={items} />
        {/* Visibility lives on a wrapper: CvLink's own `inline-flex` must not compete with `hidden`. */}
        <div className="nojs-flex hidden md:flex">
          <CvLink href={cv.path} label={cv.label} accessibleSuffix={cvSuffix} />
        </div>
        <MobileMenu
          name={profile.name}
          items={items}
          footer={
            <div className="flex flex-col gap-8">
              <CvLink
                href={cv.path}
                label={cv.label}
                accessibleSuffix={cvSuffix}
                size="lg"
                className="w-full"
              />
              <SocialLinks links={socialLinks} newTabLabel={uiCopy.newTab} />
            </div>
          }
          labels={{ open: uiCopy.menuOpen, close: uiCopy.menuClose, nav: uiCopy.primaryNavLabel }}
        />
      </Container>
    </header>
  )
}
