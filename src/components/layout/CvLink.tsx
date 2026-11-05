import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/button-styles'
import { DownloadIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

export interface CvLinkProps {
  href: string
  label: string
  /** e.g. "(PDF, 72 KB)" — announced after the visible label (FR-RES-06). */
  accessibleSuffix: string
  variant?: ButtonVariant
  size?: ButtonSize
  /** Header use: below 560 px only the icon shows (the label stays in the accessible name). */
  compact?: boolean
  className?: string
}

/**
 * The CV download link used in the header and the Experience section.
 * Accessible name: "Download CV (PDF, 72 KB)". The separating space sits outside the hidden
 * span because accessible-name computation trims text inside it.
 * Pure (no hooks, no content imports) so it can render inside client islands.
 */
export function CvLink({
  href,
  label,
  accessibleSuffix,
  variant = 'primary',
  size = 'md',
  compact = false,
  className,
}: CvLinkProps) {
  return (
    <a
      href={href}
      download
      className={cn(buttonClasses(variant, size), compact && 'max-xs:w-11 max-xs:px-0', className)}
    >
      <span className={cn('btn-label', compact && 'max-xs:sr-only')}>{label}</span>{' '}
      <span className="sr-only">{accessibleSuffix}</span>
      <DownloadIcon size={20} className="shrink-0" />
    </a>
  )
}
