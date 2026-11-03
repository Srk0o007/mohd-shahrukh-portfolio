import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { ArrowRightIcon } from './icons'

export const textLinkClasses =
  'font-semibold underline decoration-1 underline-offset-4 hover:decoration-2'

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Trailing arrow (decorative). External links use <ExternalLink>. */
  arrow?: boolean
}

/** Inline text link (DESIGN_SYSTEM §8; COMPONENT_VISUAL_SPEC §6 "Text link + arrow"). */
export function TextLink({ arrow = false, className, children, ...rest }: TextLinkProps) {
  return (
    <a
      className={cn(textLinkClasses, arrow && 'inline-flex items-center gap-2', className)}
      {...rest}
    >
      {children}
      {arrow ? <ArrowRightIcon size={16} /> : null}
    </a>
  )
}
