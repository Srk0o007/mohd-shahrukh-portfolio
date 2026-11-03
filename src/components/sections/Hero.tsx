import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { TextLink } from '@/components/ui/TextLink'
import { heroActions, profile, uiCopy } from '@/content'

const HEADING_ID = 'hero-heading'

/**
 * Hero (FR-HERO-01/02, COMPONENT_VISUAL_SPEC §8). The single <h1>; static title (D12);
 * portrait is the LCP candidate. "View My Work" / "Contact Me" target sections that arrive in
 * Phases 08–09 (owner decision: final design from the start; tracked by the anchors E2E test).
 */
export function Hero() {
  const [firstName, ...rest] = profile.name.split(' ')
  return (
    <section id="top" aria-labelledby={HEADING_ID} tabIndex={-1} className="focus:outline-none">
      <Container className="grid items-end gap-x-6 gap-y-12 pt-10 pb-(--space-section) md:grid-cols-8 md:pt-16 lg:grid-cols-12 lg:pt-20 xl:gap-x-8">
        <div className="md:col-span-5 lg:col-span-8">
          <p className="text-label font-medium text-text-muted uppercase">{uiCopy.heroEyebrow}</p>
          {/* Two lines visually; the space keeps the accessible name "Mohd Shahrukh". */}
          <h1 id={HEADING_ID} className="mt-7 font-display text-display font-medium">
            <span className="block">{firstName}</span>{' '}
            <span className="block">{rest.join(' ')}</span>
          </h1>
          <p className="mt-6 text-title-line font-medium md:mt-9">
            <span className="bg-accent box-decoration-clone px-2.5 py-0.5 text-on-accent">
              {profile.title}
            </span>
          </p>
          <p className="mt-4 text-lead text-text-muted">{profile.heroLocationLine}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-10">
            <ButtonLink href={heroActions.primary.href} size="lg">
              {heroActions.primary.label}
            </ButtonLink>
            <TextLink href={heroActions.secondary.href} arrow className="min-h-11">
              {heroActions.secondary.label}
            </TextLink>
          </div>
        </div>

        <figure className="w-full max-w-90 md:col-span-3 md:max-w-none lg:col-span-4">
          <ResponsiveImage
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 30vw, (min-width: 768px) 36vw, min(100vw, 360px)"
            priority
            className="aspect-4/5 w-full border border-rule object-cover object-[50%_20%]"
          />
          <figcaption className="mt-3 text-small text-text-muted">
            {profile.yearsOfExperience} {uiCopy.statLabel}
          </figcaption>
        </figure>
      </Container>
    </section>
  )
}
