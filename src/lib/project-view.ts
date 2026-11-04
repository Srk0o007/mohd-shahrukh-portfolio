import type { StaticImageData } from 'next/image'
import type { HttpsUrl, Project, ProjectGroup } from '@/content/types'

/** DATA_MODEL §4 — what a project card renders; derived, never stored. */
export interface ProjectView {
  id: string
  /** '01' … '10': fixed content order, not renumbered when filtering (owner decision). */
  index: string
  title: string
  subtitle: string
  group: ProjectGroup
  groupLabel: string
  image: { src: StaticImageData; alt: string; fit: 'cover' | 'contain' }
  /** Date · stack, only when verified (FR-PRJ-05). */
  meta?: string
  /** Only when `linkStatus = 'live'` (FR-PRJ-03). */
  link?: { href: HttpsUrl; text: string }
  /** Only when `linkStatus = 'none'` (FR-PRJ-04). */
  note?: string
}

export interface ProjectViewCopy {
  groupLabels: Record<ProjectGroup, string>
  /** e.g. title → "Visit SOSUDATECH Pvt. Ltd. website". */
  linkText: (title: string) => string
}

/** DS-08: wide captures fill their frame; near-square captures are shown whole. */
export const COVER_MIN_RATIO = 1.4

export function imageFit(image: Pick<StaticImageData, 'width' | 'height'>): 'cover' | 'contain' {
  return image.width / image.height >= COVER_MIN_RATIO ? 'cover' : 'contain'
}

export function toProjectView(project: Project, index: number, copy: ProjectViewCopy): ProjectView {
  const metaParts = [project.date, project.stack?.join(', ')].filter(Boolean)
  return {
    id: project.id,
    index: String(index + 1).padStart(2, '0'),
    title: project.title,
    subtitle: project.subtitle,
    group: project.group,
    groupLabel: copy.groupLabels[project.group],
    image: { src: project.image.src, alt: project.image.alt, fit: imageFit(project.image.src) },
    ...(metaParts.length > 0 ? { meta: metaParts.join(' · ') } : {}),
    ...(project.linkStatus === 'live'
      ? { link: { href: project.url, text: copy.linkText(project.title) } }
      : {}),
    ...(project.linkStatus === 'none' ? { note: project.note } : {}),
  }
}
