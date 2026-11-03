import type { Education } from './types'

/** CONTENT_SCHEMA §9 — D2 (B.Tech only). */
export const education = [
  {
    degree: 'B.Tech, Electronics & Communication Engineering',
    institution: 'Bipin Tripathi Kumaon Institute of Technology, Dwarahat',
    graduated: 2019,
  },
] as const satisfies readonly Education[]
