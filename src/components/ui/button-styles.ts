import { cn } from '@/lib/cn'

/** `ink` / `ink-outline` are only for the accent band (COMPONENT_VISUAL_SPEC §18). */
export type ButtonVariant = 'primary' | 'secondary' | 'ink' | 'ink-outline'
export type ButtonSize = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-sans text-ui font-semibold ' +
  'transition-colors duration-150 ease-standard motion-reduce:transition-none ' +
  'aria-disabled:cursor-progress'

/*
 * Filled variants carry a transparent border: invisible normally, but forced-colours mode
 * (Windows High Contrast) paints borders in the system text colour while removing fills,
 * so the button outline stays visible (NFR-BRW-04, Phase 10). Same box size as outlined.
 */
const variants: Record<ButtonVariant, string> = {
  primary: 'border border-transparent bg-primary text-on-primary hover:bg-primary-hover',
  secondary: 'border border-border text-text hover:bg-surface-2',
  // Ink on the yellow accent in both themes; contrast is the on-accent pair (COLOR_TOKENS).
  ink: 'border border-transparent bg-on-accent text-accent hover:bg-on-accent/85',
  'ink-outline': 'border border-on-accent text-on-accent hover:bg-on-accent/10',
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
