import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { DownloadIcon } from '@/components/ui/icons'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextLink } from '@/components/ui/TextLink'
import {
  contactDetails,
  ctaBand,
  cv,
  formatCopy,
  profile,
  projects,
  sectionHeadings,
  services,
  uiCopy,
} from '@/content'

/*
 * TEMPORARY Phase 06 component preview (owner-approved). It renders the real primitives and
 * tokens in light and dark panels using scoped `data-theme` (ADR 0004/0005 addenda).
 * Phase 07 replaces this page with the portfolio. Not indexed.
 */
export const metadata: Metadata = {
  title: 'Component preview — Phase 06',
  robots: { index: false, follow: false },
}

const SWATCHES = [
  { token: 'bg', className: 'bg-bg' },
  { token: 'surface', className: 'bg-surface' },
  { token: 'surface-2', className: 'bg-surface-2' },
  { token: 'text', className: 'bg-text' },
  { token: 'text-muted', className: 'bg-text-muted' },
  { token: 'rule', className: 'bg-rule' },
  { token: 'border', className: 'bg-border' },
  { token: 'accent', className: 'bg-accent' },
  { token: 'primary', className: 'bg-primary' },
  { token: 'error', className: 'bg-error' },
  { token: 'success', className: 'bg-success' },
] as const

const aboutHeading = sectionHeadings[0]
const liveProject = projects.find((project) => project.linkStatus === 'live')

function ThemePanel({ theme }: { theme: 'light' | 'dark' }) {
  const label = theme === 'light' ? 'Light theme' : 'Dark theme'
  const id = `${theme}-panel`
  return (
    <section
      data-theme={theme}
      aria-labelledby={`${id}-heading`}
      className="border-t border-rule bg-bg py-12 text-text"
    >
      <Container className="flex flex-col gap-12">
        <h2 id={`${id}-heading`} className="text-label font-medium uppercase">
          {label}
        </h2>

        <SectionHeader
          index={aboutHeading.index}
          eyebrow={aboutHeading.eyebrow}
          heading={aboutHeading.heading}
          headingId={`${id}-about`}
          intro={<p>{profile.heroLocationLine}</p>}
        />

        <div className="flex flex-col gap-3">
          <p className="font-display text-display-2 font-medium">Aa</p>
          <p className="font-display text-h3 font-medium">{projects[8].title}</p>
          <p className="font-display text-quote">{services[0].title}</p>
          <p className="text-title-line font-medium">
            <span className="bg-accent box-decoration-clone px-2.5 py-0.5 text-on-accent">
              {profile.title}
            </span>
          </p>
          <p className="max-w-[68ch] text-body text-text-muted">{services[0].description}</p>
          <p className="text-small text-text-muted">{contactDetails.location}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={cv.path} size="lg" icon={<DownloadIcon size={16} />}>
            {cv.label}
            <span className="sr-only">
              {' '}
              {formatCopy(uiCopy.cvAccessibleSuffix, { size: cv.sizeLabel })}
            </span>
          </ButtonLink>
          <ButtonLink href={ctaBand.call.href} variant="secondary" size="lg">
            {ctaBand.call.label}
          </ButtonLink>
          <Button>{contactDetails.form.submitLabel}</Button>
          <Button variant="secondary">{uiCopy.filterAll}</Button>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <TextLink href={`mailto:${contactDetails.email}`} arrow>
            {contactDetails.email}
          </TextLink>
          {liveProject?.linkStatus === 'live' ? (
            <ExternalLink href={liveProject.url} newTabLabel={uiCopy.newTab}>
              {formatCopy(uiCopy.projectLink, { title: liveProject.title })}
            </ExternalLink>
          ) : null}
        </div>

        <ul
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          aria-label="Colour tokens"
        >
          {SWATCHES.map((swatch) => (
            <li key={swatch.token} className="flex items-center gap-3 text-small">
              <span
                aria-hidden="true"
                className={`size-8 shrink-0 rounded-sm border border-border ${swatch.className}`}
              />
              <span>{swatch.token}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default function PreviewPage() {
  return (
    <main id="main" tabIndex={-1} className="focus:outline-none">
      <Container className="py-12">
        <p className="text-label font-medium text-text-muted uppercase">
          Temporary component preview · Phase 06
        </p>
        <h1 className="mt-4 font-display text-display font-medium">{profile.name}</h1>
      </Container>
      <div className="grid lg:grid-cols-2">
        <ThemePanel theme="light" />
        <ThemePanel theme="dark" />
      </div>
    </main>
  )
}
