import { ExternalLink } from '@/components/ui/ExternalLink'
import { TextLink } from '@/components/ui/TextLink'
import { cn } from '@/lib/cn'

export interface SocialLinkItem {
  id: string
  label: string
  href: string
}

export interface SocialLinksProps {
  links: readonly SocialLinkItem[]
  /** UiCopy.newTab — announced on external links. */
  newTabLabel: string
  className?: string
}

/**
 * Text-labelled social links (owner decision 2026-11-04: no brand logos).
 * https links open in a new tab via <ExternalLink>; mailto stays in the same tab.
 * Pure (no hooks, no content imports) so it can render inside the client MobileMenu.
 */
export function SocialLinks({ links, newTabLabel, className }: SocialLinksProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-3', className)}>
      {links.map((link) => (
        <li key={link.id}>
          {link.href.startsWith('https://') ? (
            <ExternalLink href={link.href as `https://${string}`} newTabLabel={newTabLabel}>
              {link.label}
            </ExternalLink>
          ) : (
            <TextLink href={link.href}>{link.label}</TextLink>
          )}
        </li>
      ))}
    </ul>
  )
}
