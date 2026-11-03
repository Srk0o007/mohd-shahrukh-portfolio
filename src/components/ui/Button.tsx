import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './button-styles'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Optional leading or trailing icon (decorative). */
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
}

/** A real <button>; defaults to type="button" so it never submits a form by accident. */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {iconPosition === 'start' && icon}
      {children}
      {iconPosition === 'end' && icon}
    </button>
  )
}
