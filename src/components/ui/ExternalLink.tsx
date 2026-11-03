import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ArrowUpRightIcon } from './icons'
import { textLinkClasses } from './TextLink'
import { VisuallyHidden } from './VisuallyHidden'

export interface ExternalLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'target' | 'rel'
> {
  href: `https://${string}`
  children: ReactNode
  /** Screen-reader announcement, supplied from content (UiCopy.newTab). */
  newTabLabel: string
  /** Show the ↗ glyph (default true). */
  showIcon?: boolean
  /** Render with text-link styling (default true); false lets callers style it fully. */
  styled?: boolean
}

/**
 * The only way to open a link in a new tab (NFR-SEC-04, NFR-A11Y-12):
 * always `rel="noopener noreferrer"` and an announced "(opens in new tab)".
 */
export function ExternalLink({
  href,
  children,
  newTabLabel,
  showIcon = true,
  styled = true,
  className,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styled && textLinkClasses, 'inline-flex items-center gap-1.5', className)}
      {...rest}
    >
      {children}
      {/* The separating space must sit outside the hidden span: accessible-name computation
          trims text inside it, which would produce "profile(opens in new tab)". */}{' '}
      {showIcon ? <ArrowUpRightIcon size={16} /> : null}
      <VisuallyHidden>{newTabLabel}</VisuallyHidden>
    </a>
  )
}
