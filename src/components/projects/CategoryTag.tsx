import type { ProjectGroup } from '@/content/types'
import { cn } from '@/lib/cn'

export interface CategoryTagProps {
  group: ProjectGroup
  label: string
}

/**
 * DS-09 (COMPONENT_VISUAL_SPEC §16): enterprise = filled tag with ■, website = outlined with □.
 * Shape and fill differ, not only colour (NFR-A11Y-04); the glyph is decorative.
 */
export function CategoryTag({ group, label }: CategoryTagProps) {
  const enterprise = group === 'enterprise'
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-2 rounded-pill px-2.5 text-label font-medium uppercase',
        enterprise
          ? 'bg-tag-enterprise-bg text-tag-enterprise-fg border border-transparent'
          : 'border-border text-text border',
      )}
    >
      {/* Forced colours remove fills; opting the glyph out keeps the filled ■ (currentColor)
          distinct from the outlined □ (NFR-BRW-04). */}
      <span
        aria-hidden="true"
        className={cn(
          'size-2',
          enterprise ? 'bg-current forced-color-adjust-none' : 'border border-current',
        )}
      />
      {label}
    </span>
  )
}
