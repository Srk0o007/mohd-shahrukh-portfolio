import { ContactForm } from '@/components/contact/ContactForm'
import { SocialLinks } from '@/components/layout/SocialLinks'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { textLinkClasses } from '@/components/ui/TextLink'
import { siteConfig } from '@/config/site'
import { contactDetails, formatCopy, getSectionHeading, socialLinks, uiCopy } from '@/content'
import { CONTACT_LIMITS } from '@/lib/validate-contact'

/**
 * 09 — Contact (FR-CON-01–07, FR-SOC-01, COMPONENT_VISUAL_SPEC §20–22, Phase 11.5): the header,
 * intro and details (each with a cyan left border) on the left; the form in a card on the right.
 * Stacked below 960 px. Copy is word for word from content; the Formspree logic is unchanged.
 */
export function Contact() {
  const heading = getSectionHeading('contact')
  const headingId = `${heading.id}-heading`
  const term = 'text-xs font-bold tracking-[0.16em] text-accent uppercase'
  const link = `${textLinkClasses} inline-flex min-h-8 items-center [overflow-wrap:anywhere]`

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <div className="grid grid-cols-1 items-start gap-14 mid:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <SectionHeader
            index={heading.index}
            eyebrow={heading.eyebrow}
            heading={heading.heading}
            headingId={headingId}
            intro={<p>{contactDetails.intro}</p>}
            className="mb-11"
          />
          <dl data-reveal="" className="mt-2 grid gap-5.5">
            <div className="border-l-2 border-accent pl-4">
              <dt className={term}>{uiCopy.factLocation}</dt>
              <dd className="mt-0.5 font-bold text-heading">{contactDetails.location}</dd>
            </div>
            <div className="border-l-2 border-accent pl-4">
              <dt className={term}>{uiCopy.contactPhone}</dt>
              <dd className="mt-0.5">
                <a href={contactDetails.phone.tel} className={link}>
                  {contactDetails.phone.display}
                </a>
              </dd>
            </div>
            <div className="border-l-2 border-accent pl-4">
              <dt className={term}>{uiCopy.contactEmail}</dt>
              <dd className="mt-0.5">
                <a href={`mailto:${contactDetails.email}`} className={link}>
                  {contactDetails.email}
                </a>
              </dd>
            </div>
          </dl>
          <div data-reveal="">
            <SocialLinks links={socialLinks} newTabLabel={uiCopy.newTab} className="mt-6.5" />
          </div>
        </div>

        <div>
          <ContactForm
            endpoint={siteConfig.formEndpoint}
            copy={{
              heading: contactDetails.form.heading,
              labels: contactDetails.form.fields,
              required: uiCopy.required,
              submit: contactDetails.form.submitLabel,
              sending: uiCopy.sending,
              success: uiCopy.sendSuccess,
              error: uiCopy.sendError,
              email: contactDetails.email,
              errors: {
                name: uiCopy.errName,
                email: uiCopy.errEmail,
                message: uiCopy.errMessage,
                tooLong: {
                  name: formatCopy(uiCopy.errTooLong, { max: CONTACT_LIMITS.name }),
                  email: formatCopy(uiCopy.errTooLong, { max: CONTACT_LIMITS.email }),
                  message: formatCopy(uiCopy.errTooLong, { max: CONTACT_LIMITS.message }),
                },
              },
            }}
          />
        </div>
      </div>
    </Section>
  )
}
