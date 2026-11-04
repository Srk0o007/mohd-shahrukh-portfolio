'use client'

import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type SubmitEvent,
} from 'react'
import { buttonClasses } from '@/components/ui/button-styles'
import { ArrowRightIcon } from '@/components/ui/icons'
import { submitContact } from '@/lib/submit-contact'
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  validateContact,
  validateField,
  type ContactError,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '@/lib/validate-contact'
import { FormField } from './FormField'
import { FormStatus } from './FormStatus'

export interface ContactFormCopy {
  heading: string
  labels: ContactValues
  required: string
  submit: string
  sending: string
  success: string
  error: string
  /** Fallback address, linked inside the error message. */
  email: string
  /** Messages per field; `tooLong` is pre-formatted with each field's limit (serialisable). */
  errors: ContactValues & { tooLong: ContactValues }
}

export interface ContactFormProps {
  /** Formspree endpoint (ADR 0006); also the no-JS form action. */
  endpoint: string
  copy: ContactFormCopy
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY: ContactValues = { name: '', email: '', message: '' }
const noopSubscribe = () => () => {}

/**
 * Contact form (FR-CON-02–07, COMPONENT_ARCHITECTURE §5).
 * - **No JS:** a real POST form to Formspree with native `required` checks (FR-CON-06).
 * - **JS:** validates on submit, then live after the first attempt; sends in the background;
 *   "Sending…" with `aria-disabled` blocks double submits; success is shown only when
 *   Formspree confirms acceptance (`submitContact`), then the form clears; on any failure the
 *   input is kept and the email address is offered.
 * - The `_gotcha` honeypot is always sent; Formspree silently discards filled ones (FR-CON-05),
 *   so the page never fakes a success.
 */
export function ContactForm({ endpoint, copy }: ContactFormProps) {
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  const [values, setValues] = useState<ContactValues>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const id = useId()
  const fields = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement>>>({})

  const message = (field: ContactField, error: ContactError | undefined) => {
    if (!error) return undefined
    return error === 'tooLong' ? copy.errors.tooLong[field] : copy.errors[field]
  }

  const revalidate = (field: ContactField, value: string) => {
    if (!attempted) return
    setErrors((current) => {
      const next = { ...current }
      const error = validateField(field, value)
      if (error) next[field] = error
      else delete next[field]
      return next
    })
  }

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as ContactField
    setValues((current) => ({ ...current, [field]: event.target.value }))
    revalidate(field, event.target.value)
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    setAttempted(true)
    const result = validateContact(values)
    if (!result.ok) {
      setErrors(result.errors)
      const first = CONTACT_FIELDS.find((field) => result.errors[field])
      if (first) fields.current[first]?.focus()
      return
    }
    setErrors({})
    setStatus('sending')
    const outcome = await submitContact(endpoint, new FormData(event.currentTarget))
    if (outcome === 'success') {
      setValues(EMPTY)
      setAttempted(false)
    }
    setStatus(outcome)
  }

  const headingId = `${id}-heading`
  const counterId = `${id}-counter`
  const sending = status === 'sending'

  return (
    <form
      action={endpoint}
      method="POST"
      // Native validation is the no-JS fallback; with JS the accessible inline errors take over.
      noValidate={hydrated}
      onSubmit={onSubmit}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-display text-h3 font-medium">
        {copy.heading}
      </h3>
      <div className="mt-8 flex flex-col gap-6">
        <FormField
          id={`${id}-name`}
          name="name"
          label={copy.labels.name}
          requiredLabel={copy.required}
          value={values.name}
          error={message('name', errors.name)}
          autoComplete="name"
          inputRef={(el) => {
            if (el) fields.current.name = el
          }}
          onChange={onChange}
          onBlur={(event) => revalidate('name', event.target.value)}
        />
        <FormField
          id={`${id}-email`}
          name="email"
          type="email"
          label={copy.labels.email}
          requiredLabel={copy.required}
          value={values.email}
          error={message('email', errors.email)}
          autoComplete="email"
          inputRef={(el) => {
            if (el) fields.current.email = el
          }}
          onChange={onChange}
          onBlur={(event) => revalidate('email', event.target.value)}
        />
        <FormField
          id={`${id}-message`}
          name="message"
          multiline
          label={copy.labels.message}
          requiredLabel={copy.required}
          value={values.message}
          error={message('message', errors.message)}
          describedBy={counterId}
          inputRef={(el) => {
            if (el) fields.current.message = el
          }}
          onChange={onChange}
          onBlur={(event) => revalidate('message', event.target.value)}
        >
          {/* DS-15: passive counter; read with the field, not live-announced (FR-CON-07). */}
          <p id={counterId} className="text-right text-small text-text-muted tabular-nums">
            {values.message.length} / {CONTACT_LIMITS.message}
          </p>
        </FormField>
        {/* Honeypot (FR-CON-05): hidden from everyone; bots that fill it are dropped by Formspree. */}
        <div hidden>
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
      </div>
      <button
        type="submit"
        aria-disabled={sending || undefined}
        className={buttonClasses('primary', 'lg', 'mt-8')}
      >
        {sending ? copy.sending : copy.submit}
        {sending ? null : <ArrowRightIcon size={20} />}
      </button>
      <FormStatus
        status={status}
        successText={copy.success}
        errorText={copy.error}
        email={copy.email}
      />
    </form>
  )
}
