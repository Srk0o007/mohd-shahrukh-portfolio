import { describe, expect, it } from 'vitest'
import { CONTACT_LIMITS, validateContact, validateField } from './validate-contact'

const valid = { name: 'Asha', email: 'asha@example.com', message: 'Hello there' }

describe('validateContact (FR-CON-03)', () => {
  it('accepts valid input and trims whitespace', () => {
    expect(
      validateContact({ name: '  Asha ', email: ' asha@example.com ', message: ' Hi ' }),
    ).toEqual({ ok: true, values: { name: 'Asha', email: 'asha@example.com', message: 'Hi' } })
  })

  it('requires every field; whitespace-only counts as empty', () => {
    expect(validateContact({ name: ' ', email: '', message: '\n\t' })).toEqual({
      ok: false,
      errors: { name: 'required', email: 'required', message: 'required' },
    })
  })

  it('checks the email format', () => {
    for (const email of ['asha', 'asha@', '@example.com', 'asha@example', 'a sha@example.com']) {
      expect(validateField('email', email), email).toBe('invalid')
    }
    expect(validateField('email', 'a.b+c@sub.example.co')).toBeNull()
  })

  it('enforces the length limits after trimming', () => {
    expect(validateField('name', 'x'.repeat(CONTACT_LIMITS.name))).toBeNull()
    expect(validateField('name', 'x'.repeat(CONTACT_LIMITS.name + 1))).toBe('tooLong')
    expect(validateField('name', ` ${'x'.repeat(CONTACT_LIMITS.name)} `)).toBeNull()
    expect(validateField('message', 'x'.repeat(5001))).toBe('tooLong')
    expect(validateField('email', `${'a'.repeat(250)}@b.co`)).toBe('tooLong')
  })

  it('reports only the invalid fields', () => {
    expect(validateContact({ ...valid, email: 'nope' })).toEqual({
      ok: false,
      errors: { email: 'invalid' },
    })
  })
})
