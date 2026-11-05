import type { Education } from './types'

/**
 * CONTENT_SCHEMA §9 — three entries verbatim from the live site's "My Education" [S]
 * (owner decision 2026-11-05, Phase 11.5; supersedes D2 "B.Tech only"). Newest first.
 */
export const education = [
  {
    degree: 'Bachelor in Electronics & Communication Engineering',
    institution: 'Bipin Tripathi Kumaon Institute Of Technology',
    from: 2016,
    to: 2019,
  },
  {
    degree: 'Diploma in Electronics Engineering',
    institution: 'Government Polytechnic Nainital',
    from: 2012,
    to: 2015,
  },
  {
    degree: 'Intermediate',
    institution: 'Mahatma Gandhi Inter College',
    from: 2010,
    to: 2012,
  },
] as const satisfies readonly Education[]
