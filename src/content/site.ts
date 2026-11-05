import { siteConfig } from '@/config/site'
import type { CvDocument, NavItem, SectionHeading, SectionId, SiteMeta } from './types'

/** CONTENT_SCHEMA §1 — title from the live site [S]; description built only from [R] facts. */
export const siteMeta = {
  title: 'Mohd Shahrukh | Software Development Engineer – Frontend',
  description:
    'Mohd Shahrukh — Software Development Engineer | Frontend with 6+ years building fintech, proptech and enterprise web apps in React.js, Next.js and TypeScript.',
  canonicalUrl: 'https://mohdshahrukh.in/',
  locale: 'en',
} as const satisfies SiteMeta

/** CONTENT_SCHEMA §3 — D15. */
export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
] as const satisfies readonly NavItem[]

/** CONTENT_SCHEMA §4 — headings from the live site [S]; indices per DS-02. */
export const sectionHeadings = [
  { id: 'about', index: '01', eyebrow: 'About', heading: 'Know Me More' },
  { id: 'services', index: '02', eyebrow: 'Services', heading: 'How I Can Help Your Next Project' },
  { id: 'experience', index: '03', eyebrow: 'Experience', heading: 'My Experience' },
  { id: 'skills', index: '04', eyebrow: 'Skills', heading: 'My Skills' },
  { id: 'certifications', index: '05', eyebrow: 'Certifications', heading: 'Certifications' },
  { id: 'education', index: '06', eyebrow: 'Education', heading: 'My Education' },
  { id: 'projects', index: '07', eyebrow: 'Projects', heading: 'Some Of My Most Recent Projects' },
  { id: 'testimonials', index: '08', eyebrow: 'Testimonials', heading: 'What My Colleagues Say' },
  { id: 'contact', index: '09', eyebrow: 'Contact', heading: "Let's get in touch" },
] as const satisfies readonly SectionHeading[]

/** Heading data for one section; the content tests guarantee every id exists (I-10). */
export function getSectionHeading(id: SectionId): SectionHeading {
  const heading = sectionHeadings.find((section) => section.id === id)
  if (!heading) throw new Error(`Missing section heading: ${id}`)
  return heading
}

/** CONTENT_SCHEMA §11 — D7 (05 Nov 2026 resume, 64,319 bytes). */
export const cv = {
  path: siteConfig.cvPath,
  label: 'Download CV',
  format: 'PDF',
  sizeLabel: '64 KB',
  updated: '2026-11',
} as const satisfies CvDocument

/** Hero calls to action [S]. */
export const heroActions = {
  primary: { label: 'View My Work', href: '#projects' },
  secondary: { label: 'Contact Me', href: '#contact' },
} as const satisfies Record<'primary' | 'secondary', NavItem>
