import type { SkillGroup } from './types'

/** CONTENT_SCHEMA §7 — [R] verbatim; no proficiency values (D5). */
export const skillGroups = [
  {
    label: 'Frontend',
    skills: [
      'React.js',
      'Next.js',
      'JavaScript (ES6+)',
      'TypeScript',
      'HTML5',
      'CSS3',
      'SCSS/SASS',
      'Tailwind CSS',
      'Bootstrap 5',
      'responsive UI',
    ],
  },
  {
    label: 'State & APIs',
    skills: [
      'Redux Toolkit',
      'React Query (TanStack Query)',
      'REST APIs',
      'async request handling',
    ],
  },
  {
    label: 'Testing',
    skills: ['Jest', 'React Testing Library', 'Playwright'],
    context: 'unit, component, UI/API integration and end-to-end testing',
  },
  {
    label: 'Architecture',
    skills: [
      'Reusable React components',
      'component libraries',
      'design systems',
      'frontend architecture',
      'code reviews',
    ],
  },
  {
    label: 'Performance & Accessibility',
    skills: [
      'Lighthouse',
      'Core Web Vitals',
      'API request optimization',
      'image optimization',
      'WCAG 2.1 AA',
      'ARIA',
      'keyboard navigation',
      'screen-reader support',
    ],
  },
  {
    label: 'Frontend Security',
    skills: ['SSO', 'token lifecycle handling', 'session management', 'secure redirects'],
  },
  {
    label: 'Cloud & Delivery',
    skills: [
      'AWS S3',
      'CloudFront',
      'Docker',
      'Vite',
      'Git',
      'GitHub/GitLab/Bitbucket',
      'CI/CD collaboration',
      'frontend release coordination',
      'Agile/Scrum',
    ],
  },
  {
    label: 'AI-Assisted Development',
    skills: ['Claude Code', 'Codex'],
    context: 'feature development, test-case writing, PR and code reviews',
  },
  {
    label: 'Design',
    skills: ['Figma', 'Balsamiq', 'wireframing', 'prototyping', 'usability feedback'],
  },
] as const satisfies readonly SkillGroup[]
