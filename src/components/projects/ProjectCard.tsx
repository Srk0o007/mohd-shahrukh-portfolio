import { ExternalLink } from '@/components/ui/ExternalLink'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { cn } from '@/lib/cn'
import type { ProjectView } from '@/lib/project-view'
import { CategoryTag } from './CategoryTag'

export interface ProjectCardProps {
  project: ProjectView
  /** Per-filter-state frame classes from `cardLayoutClasses`. */
  frameClassName: string
  sizes: string
  newTabLabel: string
}

/**
 * Project card (COMPONENT_VISUAL_SPEC §17, FR-PRJ-01/03–07). Not a full-card link: only a live
 * project has a text link, and only that card responds to hover/focus (image zoom 1.02, DS-14),
 * with no movement under reduced motion.
 */
export function ProjectCard({ project, frameClassName, sizes, newTabLabel }: ProjectCardProps) {
  const headingId = `project-${project.id}`
  const linked = Boolean(project.link)
  return (
    <article aria-labelledby={headingId} className="group/card">
      <div
        className={cn(
          'border-rule aspect-16/10 overflow-hidden border md:aspect-4/3',
          project.image.fit === 'contain' ? 'bg-surface-2' : 'bg-surface',
          frameClassName,
        )}
      >
        <ResponsiveImage
          src={project.image.src}
          alt={project.image.alt}
          sizes={sizes}
          className={cn(
            'size-full',
            project.image.fit === 'cover' ? 'object-cover object-top' : 'object-contain p-6',
            linked &&
              'ease-standard transition-transform duration-300 motion-safe:group-has-[a:focus-visible]/card:scale-102 motion-safe:group-has-[a:hover]/card:scale-102',
          )}
        />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="text-text-muted text-label font-medium tabular-nums">{project.index}</span>
        <CategoryTag group={project.group} label={project.groupLabel} />
      </div>
      <h3 id={headingId} className="font-display mt-2 text-h3 font-medium">
        {project.title}
      </h3>
      <p className="text-text-muted mt-1.5">{project.subtitle}</p>
      {project.meta ? <p className="text-text-muted mt-2 text-small">{project.meta}</p> : null}
      {project.link ? (
        <p className="mt-4">
          <ExternalLink href={project.link.href} newTabLabel={newTabLabel} className="min-h-11">
            {project.link.text}
          </ExternalLink>
        </p>
      ) : null}
      {project.note ? <p className="text-text-muted mt-4 text-small">{project.note}</p> : null}
    </article>
  )
}
