import { Card } from '@/components/ui/Card'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import type { ProjectView } from '@/lib/project-view'
import { CategoryTag } from './CategoryTag'

export interface ProjectCardProps {
  project: ProjectView
  sizes: string
  newTabLabel: string
}

/**
 * Project card (COMPONENT_VISUAL_SPEC §17, FR-PRJ-01/03–07, Phase 11.5): the image on top, then
 * number, tag, title, subtitle, meta and the link or note. Not a full-card link: only a live
 * project has a text link. Hover lifts the card and slowly zooms the image.
 */
export function ProjectCard({ project, sizes, newTabLabel }: ProjectCardProps) {
  const headingId = `project-${project.id}`
  return (
    <Card as="article" aria-labelledby={headingId} className="group/card h-full overflow-hidden">
      <div className="aspect-16/10 overflow-hidden border-b border-line bg-[#0a0a08]">
        <ResponsiveImage
          src={project.image.src}
          alt={project.image.alt}
          sizes={sizes}
          className="size-full object-cover object-top transition-transform duration-1100 ease-soft group-hover/card:scale-104"
        />
      </div>
      <div className="grid gap-1.5 px-5.5 pt-5.5 pb-6.5 sm:px-6.5">
        <div className="flex items-center gap-3">
          <span className="text-small font-bold text-accent tabular-nums">{project.index}</span>
          <CategoryTag group={project.group} label={project.groupLabel} />
        </div>
        <h3 id={headingId} className="mt-1 text-h3">
          {project.title}
        </h3>
        <p>{project.subtitle}</p>
        {project.meta ? <p className="text-small">{project.meta}</p> : null}
        {project.link ? (
          <p>
            <ExternalLink href={project.link.href} newTabLabel={newTabLabel} className="min-h-11">
              {project.link.text}
            </ExternalLink>
          </p>
        ) : null}
        {project.note ? <p className="text-small">{project.note}</p> : null}
      </div>
    </Card>
  )
}
