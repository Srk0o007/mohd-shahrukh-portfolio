import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './button-styles'

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
}

/** An <a> styled as a button (e.g. CV download, tel: links, in-page anchors). */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      {iconPosition === 'start' && icon}
      {children}
      {iconPosition === 'end' && icon}
    </a>
  )
}
