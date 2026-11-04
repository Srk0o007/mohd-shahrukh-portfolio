import { ResponsiveImage } from '@/components/ui/ResponsiveImage'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSectionHeading, testimonials } from '@/content'

/**
 * 08 — Testimonials (FR-TST-01, COMPONENT_VISUAL_SPEC §19). Both endorsements shown statically,
 * quotes word for word, names and roles only (D18); no carousel or autoplay (A2).
 */
export function Testimonials() {
  const heading = getSectionHeading('testimonials')
  const headingId = `${heading.id}-heading`

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <SectionHeader
        index={heading.index}
        eyebrow={heading.eyebrow}
        heading={heading.heading}
        headingId={headingId}
      />
      <ul className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-x-6 xl:gap-x-8">
        {testimonials.map((testimonial) => (
          <li key={testimonial.name} className="border-t border-rule pt-8">
            <figure className="flex h-full flex-col">
              <span
                aria-hidden="true"
                className="h-9 font-display text-[4rem] leading-none text-text-muted"
              >
                “
              </span>
              <blockquote className="max-w-[60ch] text-quote">
                <p>{testimonial.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <ResponsiveImage
                  src={testimonial.photo.src}
                  alt={testimonial.photo.alt}
                  sizes="56px"
                  className="size-14 shrink-0 rounded-pill border border-rule object-cover"
                />
                <span className="flex flex-col">
                  <span className="text-ui font-semibold">{testimonial.name}</span>
                  <span className="mt-1 text-small text-text-muted">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}
