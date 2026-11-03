import type { Certification } from './types'

/** CONTENT_SCHEMA §8 — D3; no dates or credential URLs (none verified). */
export const certifications = [
  {
    name: 'IBM Full Stack Software Developer',
    issuer: 'IBM / Coursera',
    credentialType: 'Professional Certificate',
  },
  { name: 'JavaScript: The Complete Guide', issuer: 'Udemy' },
  { name: 'React — The Complete Guide (incl. Next.js, Redux)', issuer: 'Udemy' },
] as const satisfies readonly Certification[]
