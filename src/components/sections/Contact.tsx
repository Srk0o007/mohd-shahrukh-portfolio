import { ContactForm } from '@/components/contact/ContactForm'
import { SocialLinks } from '@/components/layout/SocialLinks'
import { Section } from '@/components/ui/Section'
import { siteConfig } from '@/config/site'
import { contactDetails, formatCopy, getSectionHeading, socialLinks, uiCopy } from '@/content'
import { CONTACT_LIMITS } from '@/lib/validate-contact'

/**
 * 09 — Contact (FR-CON-01–07, FR-SOC-01, COMPONENT_VISUAL_SPEC §20–22). Details in columns
 * 1–5 and the form in 6–12 from 1024 px; stacked below. Copy is word for word from content.
 */
export function Contact() {
  const heading = getSectionHeading('contact')
  const headingId = `${heading.id}-heading`

  return (
    <Section id={heading.id} labelledBy={headingId}>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-6 xl:gap-x-8">
        <div className="lg:col-span-5">
          <p className="text-label font-medium text-text-muted uppercase tabular-nums">
            {heading.index} — {heading.eyebrow}
          </p>
          <h2 id={headingId} className="mt-4 font-display text-display-2 font-medium">
            {heading.heading}
          </h2>
          <p className="mt-6 max-w-[48ch] text-lead">{contactDetails.intro}</p>
          <dl className="mt-10 flex flex-col gap-5">
            <div>
              <dt className="text-label font-medium text-text-muted uppercase">
                {uiCopy.factLocation}
              </dt>
              <dd className="mt-1 font-medium">{contactDetails.location}</dd>
            </div>
            <div>
              <dt className="text-label font-medium text-text-muted uppercase">
                {uiCopy.contactPhone}
              </dt>
              <dd className="mt-1 font-medium">
                <a
                  href={contactDetails.phone.tel}
                  className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {contactDetails.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-label font-medium text-text-muted uppercase">
                {uiCopy.contactEmail}
              </dt>
              <dd className="mt-1 font-medium">
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="inline-flex min-h-11 items-center break-all underline decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {contactDetails.email}
                </a>
              </dd>
            </div>
          </dl>
          <SocialLinks links={socialLinks} newTabLabel={uiCopy.newTab} className="mt-8" />
        </div>

        <div className="lg:col-span-7">
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
