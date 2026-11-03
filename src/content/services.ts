import type { Service } from './types'

/** CONTENT_SCHEMA §5 — [S] verbatim (D20). */
export const services = [
  {
    title: 'Web Design',
    description:
      'I design compelling, visually attractive websites using HTML5, CSS3, Bootstrap, and Figma — from wireframes and high-fidelity prototypes to production, focused on clean, conversion-driven design.',
    icon: 'monitor',
  },
  {
    title: 'Frontend Engineering',
    description:
      'I build scalable React.js applications with reusable component libraries, design-system conventions, REST API integration, and compliance-critical flows — SSO, vKYC, document signing, and multi-step onboarding.',
    icon: 'pen-ruler',
  },
  {
    title: 'Accessibility & Compliance',
    description:
      'I audit and remediate web applications to WCAG 2.1 AA — implementing ARIA roles, keyboard navigation, and screen-reader support. Delivered 150+ fixes across a SEBI-regulated investor onboarding platform.',
    icon: 'accessibility',
  },
  {
    title: 'Testing & QA',
    description:
      'I author end-to-end Playwright suites and Jest / React Testing Library unit & component tests across compliance-critical flows — catching regressions before release and stabilising high-risk paths across browsers.',
    icon: 'flask',
  },
] as const satisfies readonly Service[]
