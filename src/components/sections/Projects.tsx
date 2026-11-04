import { cardImageSizes, cardLayoutClasses } from '@/components/projects/layout-classes'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectGallery, type FilterOption } from '@/components/projects/ProjectGallery'
import { Section } from '@/components/ui/Section'
import { formatCopy, getSectionHeading, projects, uiCopy } from '@/content'
import { cn } from '@/lib/cn'
import { countsByFilter, layoutsByFilter } from '@/lib/project-layout'
import { toProjectView } from '@/lib/project-view'

/**
 * 07 — Projects (FR-PRJ-01–07, DS-07–09). All ten projects in content order with their
 * original images; titles, subtitles and notes verbatim; a link only where one is verified live.
 */
export function Projects() {
  const heading = getSectionHeading('projects')
  const headingId = `${heading.id}-heading`

  const views = projects.map((project, index) =>
    toProjectView(project, index, {
      groupLabels: { enterprise: uiCopy.tagEnterprise, website: uiCopy.tagWebsite },
      linkText: (title) => formatCopy(uiCopy.projectLink, { title }),
    }),
  )
  const layouts = layoutsByFilter(views)
  const counts = countsByFilter(views)
  const status = (n: number) => formatCopy(uiCopy.filterStatus, { n, total: counts.all })
  const filters: FilterOption[] = [
    { value: 'all', label: uiCopy.filterAll, status: status(counts.all) },
    { value: 'enterprise', label: uiCopy.filterEnterprise, status: status(counts.enterprise) },
    { value: 'website', label: uiCopy.filterWebsites, status: status(counts.website) },
  ]

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <ProjectGallery
        header={{
          index: heading.index,
          eyebrow: heading.eyebrow,
          heading: heading.heading,
          headingId,
        }}
        filters={filters}
      >
        {views.map((project, index) => {
          const layout = layouts[index] ?? { all: null, enterprise: null, website: null }
          const classes = cardLayoutClasses(layout)
          return (
            <li key={project.id} data-group={project.group} className={cn('min-w-0', classes.item)}>
              <ProjectCard
                project={project}
                frameClassName={classes.frame}
                sizes={cardImageSizes(layout.all)}
                newTabLabel={uiCopy.newTab}
              />
            </li>
          )
        })}
      </ProjectGallery>
    </Section>
  )
}
