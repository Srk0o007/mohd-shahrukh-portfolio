import { Container } from '@/components/ui/Container'
import { cv, formatCopy, navItems, profile, socialLinks, uiCopy } from '@/content'
import { siteAnchor } from '@/lib/links'
import { CvLink } from './CvLink'
import { MobileMenu } from './MobileMenu'
import { PrimaryNav } from './PrimaryNav'
import { SocialLinks } from './SocialLinks'
import { ThemeToggle } from './ThemeToggle'

/**
 * Sticky site header (FR-NAV-01, COMPONENT_VISUAL_SPEC §2). Responsive contract:
 * - < 768 px: wordmark + theme toggle + menu button (CV link inside the menu)
 * - 768–1279 px: wordmark + theme toggle + CV link + menu button
 * - ≥ 1280 px: wordmark + inline navigation + theme toggle + CV link
 * Links use "/#id" so they also work from the 404 page. The theme toggle is also in the menu.
 */
export function SiteHeader() {
  const items = navItems.map((item) => ({ label: item.label, href: siteAnchor(item.href) }))
  const cvSuffix = formatCopy(uiCopy.cvAccessibleSuffix, { size: cv.sizeLabel })
  const themeLabels = { toDark: uiCopy.themeToDark, toLight: uiCopy.themeToLight }

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg">
      {/* 12 px gaps below 768 px keep wordmark + two 44 px controls within 320 px. */}
      <Container className="flex min-h-16 flex-wrap items-center gap-x-3 gap-y-2 py-2.5 md:min-h-18 md:gap-x-6">
        <a
          href={siteAnchor('#top')}
          className="mr-auto inline-flex min-h-11 items-center font-display text-wordmark font-semibold no-underline"
        >
          {profile.name}
        </a>
        <PrimaryNav label={uiCopy.primaryNavLabel} items={items} />
        <ThemeToggle labels={themeLabels} />
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
              <div className="flex flex-wrap items-center justify-between gap-6">
                <SocialLinks links={socialLinks} newTabLabel={uiCopy.newTab} />
                <ThemeToggle labels={themeLabels} />
              </div>
            </div>
          }
          labels={{ open: uiCopy.menuOpen, close: uiCopy.menuClose, nav: uiCopy.primaryNavLabel }}
        />
      </Container>
    </header>
  )
}
