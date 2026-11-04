import type { ProjectGroup } from '@/content/types'
import { cn } from '@/lib/cn'

export interface CategoryTagProps {
  group: ProjectGroup
  label: string
}

/**
 * DS-09 (COMPONENT_VISUAL_SPEC §16, Phase 11.5): an outlined uppercase pill. Enterprise products
 * use a cyan rim and cyan text; websites a white rim. The label text names the group, so the
 * colour is never the only cue (NFR-A11Y-04).
 */
export function CategoryTag({ group, label }: CategoryTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-2.5 py-0.75 text-xs font-bold tracking-[0.1em] uppercase',
        group === 'enterprise' ? 'border-rim text-accent' : 'border-line-strong text-heading',
      )}
    >
      {label}
    </span>
  )
}
