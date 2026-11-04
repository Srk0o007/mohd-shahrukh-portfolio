import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { ArrowRightIcon } from './icons'

/**
 * Phase 11.5 text link: white, bold, cyan 2 px underline; hover turns the text cyan and the
 * underline blue. Icons inside are cyan.
 */
export const textLinkClasses =
  'font-bold text-heading underline decoration-accent decoration-2 underline-offset-[5px] ' +
  'transition-[color,text-decoration-color] duration-400 ease-soft ' +
  'hover:text-accent hover:decoration-accent-2 [&_svg]:text-accent'

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  /** Trailing arrow (decorative). External links use <ExternalLink>. */
  arrow?: boolean
}

/** Inline text link (DESIGN_SYSTEM §8; COMPONENT_VISUAL_SPEC §6 "Text link + arrow"). */
export function TextLink({ arrow = false, className, children, ...rest }: TextLinkProps) {
  return (
    <a
      className={cn(textLinkClasses, arrow && 'inline-flex items-center gap-1', className)}
      {...rest}
    >
      {children}
      {arrow ? <ArrowRightIcon size={16} /> : null}
    </a>
  )
}
