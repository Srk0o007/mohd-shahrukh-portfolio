import { TestimonialSlider } from '@/components/testimonials/TestimonialSlider'
import { Card } from '@/components/ui/Card'
import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatCopy, getSectionHeading, testimonials, uiCopy } from '@/content'

/**
 * 08 — Testimonials (FR-TST-01, COMPONENT_VISUAL_SPEC §19, Phase 11.5): a slider with one large
 * centred quote at a time (ADR 0016, supersedes A2). Quotes word for word, names and roles only
 * (D18). The cards are server-rendered; the slider island only moves between them.
 */
export function Testimonials() {
  const heading = getSectionHeading('testimonials')
  const headingId = `${heading.id}-heading`
  const total = testimonials.length

  const slides = testimonials.map((testimonial) => (
    <Card
      key={testimonial.name}
      as="figure"
      hover={false}
      reveal={false}
      className="slide-card p-[clamp(28px,5vw,52px)] text-center"
    >
      <span
        aria-hidden="true"
        className="block h-11 text-[5.625rem] leading-[0.6] font-bold text-accent"
      >
        “
      </span>
      <blockquote className="mt-4.5 text-quote text-soft">
        <p>{testimonial.quote}</p>
      </blockquote>
      <figcaption className="mt-7.5 flex items-center justify-center gap-3.5 border-t border-line pt-6 text-left">
        <ResponsiveImage
          src={testimonial.photo.src}
          alt={testimonial.photo.alt}
          sizes="54px"
          className="size-13.5 shrink-0 rounded-full border border-rim object-cover"
        />
        <span>
          <b className="block text-lead text-heading">{testimonial.name}</b>
          <span className="text-small">{testimonial.role}</span>
        </span>
      </figcaption>
    </Card>
  ))

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
        center
        className="mb-11"
      />
      <div data-reveal="">
        <TestimonialSlider
          label={uiCopy.carouselLabel}
          slides={slides}
          slideLabels={testimonials.map((_, i) =>
            formatCopy(uiCopy.slideLabel, { n: i + 1, total }),
          )}
          dotLabels={testimonials.map((_, i) => formatCopy(uiCopy.slideShow, { n: i + 1 }))}
          previousLabel={uiCopy.slidePrevious}
          nextLabel={uiCopy.slideNext}
        />
      </div>
    </Section>
  )
}
