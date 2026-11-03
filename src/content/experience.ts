import type { Experience } from './types'

/** CONTENT_SCHEMA §6 — [R] resume of 03 Nov 2026, verbatim; newest first; D1 (no "Present"). */
export const experience = [
  {
    id: 'altinvest',
    company: 'AltInvest Online Platform',
    companyNote: 'formerly PropShare',
    role: 'Software Development Engineer',
    location: 'Bangalore',
    start: '2024-05',
    end: '2026-10',
    tagline: "India's SEBI-regulated SM REIT investment platform",
    highlights: [
      'Built and maintained investor-facing features for a SEBI-regulated SM REIT platform serving 5,000+ registered investors using React.js, Next.js and TypeScript, with Redux Toolkit for client state and React Query for server state, caching and submission mutations.',
      'Delivered the Single Sign-On (SSO) module, implementing secure token lifecycle handling, session expiry, protected cross-module redirects and error-recovery states.',
      'Owned key investor journeys including multi-step onboarding, profile/taxation resubmission, disclosures and payment interfaces, with conditional flows for resident and NRI investors.',
      'Integrated the DigiO video-KYC SDK, implementing asynchronous verification states, session polling and fallback handling for incomplete or failed attempts.',
      'Implemented document-signing and consent-capture experiences with signature-status tracking, confirmation states and audit-trail support.',
      'Developed the compliance document upload module using AI-assisted development with Claude Code, defining its component architecture and folder conventions with reusable React components and shared UI patterns.',
      'Wrote Jest and React Testing Library tests for components and UI/API integration, and Playwright end-to-end tests for SSO, onboarding, vKYC and document-signing journeys; used Claude Code and Codex to write test cases and support PR and code reviews.',
      'Optimized an API-dependent workflow from ~110 seconds to 2–3 seconds by removing duplicate requests, parallelizing independent calls, improving payload handling and resolving asynchronous race conditions.',
      'Reduced large image assets from ~15–30 MB to 300–400 KB through compression and render-size optimization, and resolved 150+ WCAG 2.1 AA accessibility issues across critical investor journeys.',
      'Integrated AWS S3 for file uploads and storage and CloudFront for static asset and document delivery; prepared frontend builds and coordinated releases with DevOps and backend teams.',
      'Built the PropShare Titania commercial real-estate listings experience with responsive, filterable property search.',
    ],
  },
  {
    id: 'brandsystems',
    company: 'BrandSystems India Pvt. Ltd.',
    role: 'Web Developer',
    location: 'Bangalore',
    start: '2021-12',
    end: '2024-04',
    highlights: [
      'Owned frontend development of LAM, a multi-channel campaign-management platform, building analytics dashboards and campaign-scheduling interfaces.',
      'Built data visualizations for impressions, CTR and conversions; worked with backend developers on API contracts and data integration.',
      'Prototyped feature and module flows in Balsamiq to align product and stakeholders before development.',
      'Built MARCOM, a responsive market-research management tool using JavaScript and Tailwind CSS, delivering production UI from wireframes and prototypes.',
    ],
  },
  {
    id: 'sosudatech',
    company: 'SOSUDATECH Pvt. Ltd.',
    role: 'UI/UX Developer',
    location: 'Noida',
    start: '2020-09',
    end: '2021-11',
    highlights: [
      'Delivered 10+ client websites and web applications, owning frontend implementation from wireframes through production deployment.',
      'Built reusable UI components and design patterns, and improved maintainability through clean, modular frontend code.',
    ],
  },
] as const satisfies readonly Experience[]
