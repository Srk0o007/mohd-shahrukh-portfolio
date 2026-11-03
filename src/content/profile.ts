import portrait from '@/assets/images/portrait/headshot.png'
import type { Profile } from './types'

/** CONTENT_SCHEMA §2 — [R] resume of 03 Nov 2026, [S] live site; D12, D14. */
export const profile = {
  name: 'Mohd Shahrukh',
  title: 'Software Development Engineer | Frontend',
  location: 'Bangalore, Karnataka, India',
  heroLocationLine: 'Based in Bangalore, Karnataka, India.',
  summary:
    'Frontend Engineer with 6+ years of experience building fintech, proptech and enterprise web applications. At AltInvest (formerly PropShare), delivered SSO, investor onboarding, video KYC, document signing and compliance journeys for a SEBI-regulated SM REIT platform. Hands-on experience with React.js, Next.js, TypeScript, Redux Toolkit and React Query, with testing in Jest, React Testing Library and Playwright. Strong in frontend performance, API request optimization and WCAG 2.1 AA accessibility.',
  yearsOfExperience: '6+',
  portrait: { src: portrait, alt: 'Portrait of Mohd Shahrukh' },
} as const satisfies Profile
