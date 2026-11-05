import { cn } from '@/lib/cn'

/**
 * Phase 11.5 buttons (COMPONENT_VISUAL_SPEC §6, frozen prototype):
 * - `primary`: cyan pill; on hover a cyan → blue gradient slides in, it lifts 2 px and glows.
 * - `ghost`: dark fill with a cyan rim; on hover the rim and the label turn into the gradient.
 * The hover styles live in globals.css (`.btn`, `.btn-primary`, `.btn-ghost`); the label is
 * wrapped in `.btn-label` by <Button>, <ButtonLink> and <CvLink> so the ghost label can take
 * the gradient.
 */
export type ButtonVariant = 'primary' | 'ghost'
export type ButtonSize = 'md' | 'lg'

/*
 * Both variants carry a transparent border: invisible normally, but forced-colours mode
 * (Windows High Contrast) paints borders in the system text colour while removing fills, so
 * the button outline stays visible (NFR-BRW-04, Phase 10).
 */
const base =
  'btn relative inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-pill ' +
  'border border-transparent font-sans font-bold no-underline aria-disabled:cursor-progress'

const variants: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
}

/** md = 44 px, lg = 52 px tall (targets ≥ 44 px, WCAG 2.5.8). */
const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4.5 text-small',
  lg: 'min-h-13 px-6.5 text-body',
}

/** Shared by <Button>, <ButtonLink> and <CvLink> so all render identically. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className)
}
