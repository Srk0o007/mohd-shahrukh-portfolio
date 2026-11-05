import type { SkillGroup } from './types'

/** CONTENT_SCHEMA §7 — [R] verbatim (05 Nov 2026 resume); no proficiency values (D5). */
export const skillGroups = [
  {
    label: 'Languages',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3'],
  },
  {
    label: 'Frameworks & Libraries',
    skills: ['React.js', 'Next.js'],
  },
  {
    label: 'Styling & UI',
    skills: ['SCSS/SASS', 'Tailwind CSS', 'Bootstrap 5', 'shadcn/ui', 'Material UI'],
  },
  {
    label: 'State Management',
    skills: ['Redux Toolkit', 'React Query (TanStack Query)'],
    context: 'Redux Toolkit for client state; React Query for server state, caching and mutations',
  },
  {
    label: 'API Integration',
    skills: ['REST APIs', 'async request handling', 'request deduplication', 'parallel API calls'],
  },
  {
    label: 'Testing',
    skills: ['Jest', 'React Testing Library', 'Playwright'],
    context: 'unit, component, UI/API integration and end-to-end tests',
  },
  {
    label: 'Architecture & Security',
    skills: [
      'Reusable React components',
      'component libraries',
      'design systems',
      'modular architecture',
      'code reviews',
      'SSO',
      'token lifecycle',
      'session management',
      'secure redirects',
    ],
  },
  {
    label: 'Performance & Accessibility',
    skills: [
      'Lighthouse',
      'Core Web Vitals',
      'API request optimisation',
      'image optimisation',
      'WCAG 2.1 AA',
      'ARIA',
      'keyboard navigation',
      'screen-reader support',
    ],
  },
  {
    label: 'AI-Assisted Development',
    skills: ['Claude Code', 'Codex'],
    context: 'feature development, test writing, PR and code reviews',
  },
  {
    label: 'Tools',
    skills: [
      'AWS S3',
      'CloudFront',
      'Docker',
      'Vite',
      'Git',
      'GitHub/GitLab/Bitbucket',
      'CI/CD pipelines',
      'Figma',
      'Balsamiq',
    ],
  },
] as const satisfies readonly SkillGroup[]
