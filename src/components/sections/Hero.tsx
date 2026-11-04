import { ButtonLink } from '@/components/ui/ButtonLink'
import { ArrowRightIcon } from '@/components/ui/icons'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { heroActions, profile, uiCopy } from '@/content'

const HEADING_ID = 'hero-heading'

/**
 * Hero (FR-HERO-01/02, COMPONENT_VISUAL_SPEC §8, Phase 11.5). The single <h1>; static title
 * (D12). A "Portfolio" chip with a glowing dot, the role, the name on two lines ("Shahrukh" in
 * gradient text), the location and two CTAs. The portrait is a morphing organic shape with a
 * spinning cyan rim, two orbit rings and two glass stat chips; it is the LCP image.
 * `data-speed` values drive the parallax (motion module); all motion stops under reduced motion.
 */
export function Hero() {
  const [firstName, ...rest] = profile.name.split(' ')
  return (
    <section
      id="top"
      aria-labelledby={HEADING_ID}
      tabIndex={-1}
      className="mx-auto grid w-full max-w-305 grid-cols-1 items-center gap-16 overflow-x-clip pt-12 pr-(--gutter-r) pb-27.5 pl-(--gutter) focus:outline-none mid:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] mid:gap-12 mid:pt-18"
    >
      <div>
        <p
          data-speed="-0.06"
          className="on-wave inline-flex items-center gap-2.5 rounded-pill border border-rim bg-accent/6 py-1.5 pr-4 pl-3 text-label font-bold tracking-[0.16em] text-heading uppercase"
        >
          <span aria-hidden="true" className="glow-dot size-2 rounded-full bg-accent" />
          {uiCopy.heroEyebrow}
        </p>
        <p data-speed="-0.08" className="on-wave mt-7 text-role">
          {profile.title}
        </p>
        {/* Two lines visually; the space keeps the accessible name "Mohd Shahrukh". */}
        <h1 id={HEADING_ID} className="on-wave mt-2.5 text-hero">
          <span data-speed="-0.12" className="block">
            {firstName}
          </span>{' '}
          <span
            data-speed="-0.2"
            className="grad-text block pb-[0.08em] drop-shadow-[0_0_14px_var(--halo)] [text-shadow:none]"
          >
            {rest.join(' ')}
          </span>
        </h1>
        <p data-speed="-0.1" className="on-wave mt-6.5 text-lead">
          {profile.heroLocationLine}
        </p>
        <div data-speed="-0.1" className="mt-8.5 flex flex-wrap gap-3.5">
          <ButtonLink href={heroActions.primary.href} size="lg" icon={<ArrowRightIcon size={20} />}>
            {heroActions.primary.label}
          </ButtonLink>
          <ButtonLink href={heroActions.secondary.href} variant="ghost" size="lg">
            {heroActions.secondary.label}
          </ButtonLink>
        </div>
      </div>

      <figure className="group/art relative w-[min(100%,380px)] justify-self-center mid:w-[min(100%,440px)]">
        <div
          aria-hidden="true"
          data-speed="0.12"
          className="pointer-events-none absolute -inset-[8%] rounded-full border border-dashed border-[rgb(0_194_255/0.26)]"
        >
          <span className="orbit-spin absolute inset-0 rounded-full">
            <span className="orbit-dot absolute -top-1.25 left-1/2 -ml-1.25 size-2.5 rounded-full bg-accent" />
          </span>
        </div>
        <div
          aria-hidden="true"
          data-speed="0.18"
          className="pointer-events-none absolute top-[4%] -right-[14%] bottom-[10%] left-[2%] rounded-full border border-[rgb(255_255_255/0.06)]"
        >
          <span className="orbit-spin-slow absolute inset-0 rounded-full">
            <span className="orbit-dot absolute -top-[3.5px] left-1/2 -ml-[3.5px] size-1.75 rounded-full bg-accent-3" />
          </span>
        </div>
        <div data-speed="0.06" className="blob relative p-0.75">
          <div className="overflow-hidden rounded-[inherit] bg-frame">
            <ResponsiveImage
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              sizes="(min-width: 960px) 440px, min(calc(100vw - 40px), 380px)"
              priority
              className="aspect-[1/1.14] w-full scale-104 object-cover object-[50%_16%] transition-transform duration-1200 ease-soft group-hover/art:scale-108"
            />
          </div>
        </div>
        <figcaption
          data-speed="-0.22"
          className="glass absolute bottom-5 -left-1.5 grid rounded-xl px-5 py-3.5 sm:bottom-9 sm:-left-7"
        >
          <b className="text-stat text-heading">{profile.yearsOfExperience}</b>{' '}
          <span className="text-label">{uiCopy.statLabel}</span>
        </figcaption>
        <div
          aria-hidden="true"
          data-speed="-0.3"
          className="glass absolute top-4.5 -right-1.5 grid rounded-xl px-5 py-3.5 sm:top-7 sm:-right-6"
        >
          <b className="text-lead leading-tight text-accent">{uiCopy.heroStackTitle}</b>
          <span className="text-label">{uiCopy.heroStackLine}</span>
        </div>
      </figure>
    </section>
  )
}
