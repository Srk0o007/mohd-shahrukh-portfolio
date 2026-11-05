import type { ProjectGroup } from '@/content/types'

/**
 * Per-state visibility (ADR 0013). The gallery list carries `data-filter` and the
 * `group/gallery` name; each card is pre-rendered with the class that hides it in the other
 * group's state, so switching filters needs no client re-render of the cards. Nothing is ever
 * hidden in the "All" state. Classes are written out in full so Tailwind can find them.
 */
const HIDDEN_IN_OTHER_STATE: Record<ProjectGroup, string> = {
  enterprise: 'group-data-[filter=website]/gallery:hidden',
  website: 'group-data-[filter=enterprise]/gallery:hidden',
}

export function cardFilterClass(group: ProjectGroup): string {
  return HIDDEN_IN_OTHER_STATE[group]
}

/** Two equal columns from 640 px inside the 1180 px container (COMPONENT_ARCHITECTURE §6). */
export const CARD_IMAGE_SIZES = '(min-width: 1220px) 580px, (min-width: 640px) 48vw, 100vw'
