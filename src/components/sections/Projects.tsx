import { CARD_IMAGE_SIZES, cardFilterClass } from '@/components/projects/layout-classes'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectGallery, type FilterOption } from '@/components/projects/ProjectGallery'
import { Section } from '@/components/ui/Section'
import { formatCopy, getSectionHeading, projects, uiCopy } from '@/content'
import { countsByFilter } from '@/lib/project-layout'
import { toProjectView } from '@/lib/project-view'

/**
 * 07 — Projects (FR-PRJ-01–07, DS-07–09, Phase 11.5). All ten projects in content order with
 * their original images in a two-column grid of cards; titles, subtitles and notes verbatim; a
 * link only where one is verified live. Filter chips beside the heading (ADR 0013).
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
        groupLabel={uiCopy.filterGroupLabel}
        filters={filters}
      >
        {views.map((project) => (
          <li
            key={project.id}
            data-group={project.group}
            className={`min-w-0 ${cardFilterClass(project.group)}`}
          >
            <ProjectCard project={project} sizes={CARD_IMAGE_SIZES} newTabLabel={uiCopy.newTab} />
          </li>
        ))}
      </ProjectGallery>
    </Section>
  )
}
