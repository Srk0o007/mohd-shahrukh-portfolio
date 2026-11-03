import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-sans text-ui font-semibold ' +
  'transition-colors duration-150 ease-standard motion-reduce:transition-none ' +
  'aria-disabled:cursor-progress'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border border-border text-text hover:bg-surface-2',
}

/** md = 44 px, lg = 52 px tall (COMPONENT_VISUAL_SPEC §6; targets ≥ 44 px). */
const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5',
  lg: 'min-h-13 px-7',
}

/** Shared by <Button> and <ButtonLink> so both render identically. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className)
}
