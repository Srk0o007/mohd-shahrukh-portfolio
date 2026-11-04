/** Contact form rules (FR-CON-03). Pure; messages are mapped from UiCopy by the form. */

export type ContactField = 'name' | 'email' | 'message'
export type ContactValues = Record<ContactField, string>
export type ContactError = 'required' | 'invalid' | 'tooLong'
export type ContactErrors = Partial<Record<ContactField, ContactError>>

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const

/** Field order, used to focus the first invalid field. */
export const CONTACT_FIELDS: readonly ContactField[] = ['name', 'email', 'message']

// Pragmatic format check: something@something.tld, no spaces. Delivery is the real test.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateField(field: ContactField, raw: string): ContactError | null {
  const value = raw.trim()
  if (value === '') return 'required'
  if (value.length > CONTACT_LIMITS[field]) return 'tooLong'
  if (field === 'email' && !EMAIL_PATTERN.test(value)) return 'invalid'
  return null
}

export function validateContact(
  values: ContactValues,
): { ok: true; values: ContactValues } | { ok: false; errors: ContactErrors } {
  const errors: ContactErrors = {}
  for (const field of CONTACT_FIELDS) {
    const error = validateField(field, values[field])
    if (error) errors[field] = error
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors }
  return {
    ok: true,
    values: {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    },
  }
}
