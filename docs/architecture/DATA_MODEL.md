# Data Model

**Phase:** 05 — Technical Architecture
**Date:** 2026-11-04

This translates [CONTENT_SCHEMA.md](../requirements/CONTENT_SCHEMA.md) into TypeScript. The code below is the **specification** for `src/content/types.ts` (Phase 06). Values come only from the approved content sources: [CONTENT_INVENTORY.md](../audit/CONTENT_INVENTORY.md) and decisions D1–D21.

---

## 1. Principles

1. **One source.** All copy, links and image references live in `src/content/` (NFR-MNT-03).
2. **Types encode rules.** Illegal states are unrepresentable where practical, for example a live project without a URL.
3. **No runtime validation library.** Compile-time types plus Vitest invariant tests ([ADR 0003](adr/0003-typed-content-modules.md)).
4. **Optional means absent.** Optional fields are omitted when unverified; there are no empty strings or placeholders.
5. **Literal data.** Content objects use `as const satisfies T`, so they keep literal types and are checked against the schema.

## 2. Primitive types

```ts
// src/content/types.ts
import type { StaticImageData } from 'next/image'

export type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'
export type YearMonth = `${number}-${Month}`            // e.g. "2024-05"
export type HttpsUrl = `https://${string}`
export type MailtoUrl = `mailto:${string}`
export type TelUrl = `tel:+${string}`
export type Anchor = `#${string}`
export type SitePath = `/${string}`

/** Text that may contain **bold** emphasis only (rendered by a tiny formatter, no Markdown library). */
export type RichText = string

export interface ImageAsset {
  src: StaticImageData                                   // static import → width/height known
  alt: string                                            // '' only when decorative
  blurred?: true                                         // enterprise screenshots (DS-09)
}
```

## 3. Content types

```ts
export interface SiteMeta {
  title: string                     // ≤ 70 chars
  description: string               // ≤ 160 chars
  canonicalUrl: HttpsUrl            // 'https://mohdshahrukh.in/'
  locale: 'en'
}

export interface NavItem { label: string; href: Anchor }

export interface SectionHeading {
  id: SectionId
  index: string                     // '01' … '09' (DS-02)
  eyebrow: string                   // matches the nav label (D15)
  heading: string                   // from the live site ([S])
}
export type SectionId =
  | 'about' | 'services' | 'experience' | 'skills' | 'certifications'
  | 'education' | 'projects' | 'testimonials' | 'contact'

export interface CvDocument {
  path: SitePath
  label: 'Download CV'
  format: 'PDF'
  sizeLabel: string                 // e.g. '72 KB' (recomputed when the file changes)
  updated: YearMonth
}

export interface Profile {
  name: string
  title: string                     // 'Software Development Engineer | Frontend' (D12)
  location: string                  // 'Bangalore, Karnataka, India' (D14)
  heroLocationLine: string
  summary: string                   // [R] executive summary, word for word
  yearsOfExperience: '6+'
  portrait: ImageAsset
}

export interface Service { title: string; description: string; icon: ServiceIcon }
export type ServiceIcon = 'monitor' | 'pen-ruler' | 'accessibility' | 'flask'

export interface Experience {
  id: 'altinvest' | 'brandsystems' | 'sosudatech'
  company: string
  companyNote?: string              // 'formerly PropShare'
  role: string
  location: string
  start: YearMonth
  end: YearMonth                    // no "Present" (D1)
  tagline?: string
  highlights: readonly [RichText, ...RichText[]]   // non-empty
}

export interface SkillGroup { label: string; skills: readonly string[]; context?: string }

export interface Certification {
  name: string
  issuer: string
  credentialType?: string
  issued?: YearMonth                // no verified value today
  credentialUrl?: HttpsUrl          // no verified value today
}

export interface Education { degree: string; institution: string; graduated: number }

export type ProjectGroup = 'enterprise' | 'website'

interface ProjectBase {
  id: string                        // kebab-case slug, unique
  title: string
  subtitle: string
  group: ProjectGroup
  image: ImageAsset
  description?: string              // owner-supplied only (Q8)
  date?: string                     // verified only
  stack?: readonly string[]         // verified only
  role?: string                     // owner-supplied only
  relatedExperienceId?: Experience['id']
}

/** Discriminated union: a URL exists if and only if the project is live (FR-PRJ-03/04). */
export type Project =
  | (ProjectBase & { linkStatus: 'live'; url: HttpsUrl })
  | (ProjectBase & { linkStatus: 'pending' })
  | (ProjectBase & { linkStatus: 'none'; note: string })   // D11

export interface Testimonial {
  quote: string
  name: string
  role: string
  photo: ImageAsset
}

export interface SocialLink {
  id: 'linkedin' | 'github' | 'email'
  label: string                     // accessible name
  href: HttpsUrl | MailtoUrl
}

export interface ContactDetails {
  heading: string
  intro: string
  location: string
  phone: { display: string; tel: TelUrl }
  email: string
  form: {
    heading: string
    fields: { name: string; email: string; message: string }
    submitLabel: string
  }
}

export interface CtaBand {
  heading: string
  call: { label: string; href: TelUrl }
  hire: { label: string; href: Anchor }
}

export interface Footer { copyrightTemplate: string; credit: string }  // '{year}' replaced at build

export interface UiCopy { /* keys from CONTENT_SCHEMA §13; values are strings, '{n}'-style placeholders */ }
```

## 4. View models (for client islands)

Client islands receive **plain, serialisable** data. `StaticImageData` is serialisable (`src`, `width`, `height`, `blurDataURL?`).

```ts
export interface ProjectView {
  id: string
  index: string                     // '01'…'10' (content order, zero-padded)
  title: string
  subtitle: string
  group: ProjectGroup
  groupLabel: string                // UiCopy.tagEnterprise / tagWebsite: 'Enterprise product' | 'Website'
  image: { src: StaticImageData; alt: string; fit: 'cover' | 'contain' }   // DS-08
  meta?: string                     // date · stack, when verified
  link?: { href: HttpsUrl; text: string }      // only when live
  note?: string                     // only when linkStatus = 'none'
}

export interface FilterOption { value: 'all' | ProjectGroup; label: string; status: string }  // status pre-formatted
```

`toProjectView(project, index, copy)` lives in `lib/project-view.ts` and is unit-tested. It derives `fit` from `width / height ≥ 1.4`; `copy` supplies the group labels and link text so `lib/` never imports content. Since [ADR 0013](adr/0013-server-rendered-project-filter.md), `ProjectView` is consumed by the server-rendered `ProjectCard`; only `FilterOption[]` crosses into the client island.

## 5. Invariants and validation

| # | Invariant | Enforced by |
|---|---|---|
| I-1 | Required fields are present and non-empty | Types + `content.test.ts` (no `''` except decorative alt) |
| I-2 | `url` exists **iff** `linkStatus = 'live'` | Discriminated union (compile time) |
| I-3 | `linkStatus = 'none'` has a `note` | Discriminated union |
| I-4 | Experience sorted newest first; `start ≤ end` | `content.test.ts` |
| I-5 | Project, experience and social IDs are unique | `content.test.ts` |
| I-6 | All `HttpsUrl` values start with `https://` | Template literal type |
| I-7 | `SiteMeta.title` ≤ 70, `description` ≤ 160 chars | `content.test.ts` |
| I-8 | Exactly 10 projects; groups: 3 enterprise, 7 website (D6, D10) | `content.test.ts` (an intentional guard against accidental loss) |
| I-9 | No "Present" in the experience dates (D1); no Twitter link (D4) | `content.test.ts` |
| I-10 | Section indices are `01`…`09` in page order (DS-02) | `content.test.ts` |
| I-11 | Every image `alt` is non-empty (none are decorative in content) | `content.test.ts` |

When content intentionally changes (for example, a new project), the guard tests (I-8) are updated in the same PR.

## 6. Example (abbreviated)

```ts
// src/content/projects.ts
import type { Project } from './types'
import sosudatech from '@/assets/images/projects/sosudatech.png'
import lam from '@/assets/images/projects/campaign-management.png'

export const projects = [
  {
    id: 'campaign-management',
    title: 'Campaign Management',
    subtitle: 'LAM - Campaign Management Software',
    group: 'enterprise',
    image: { src: lam, alt: 'Blurred screenshot of the LAM campaign management software', blurred: true },
    linkStatus: 'none',
    note: 'Internal product — no public link',
    relatedExperienceId: 'brandsystems',
  },
  {
    id: 'sosudatech',
    title: 'SOSUDATECH Pvt. Ltd.',
    subtitle: 'Education',
    group: 'website',
    image: { src: sosudatech, alt: 'Screenshot of the SOSUDATECH Pvt. Ltd. website' },
    linkStatus: 'live',
    url: 'https://www.sosudatech.com/',
    date: 'Nov 2020',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap 4.5', 'Photoshop'],
  },
  // … 8 more, exactly as in CONTENT_SCHEMA §10
] as const satisfies readonly Project[]
```

## 7. Updating content (owner workflow)

| Change | Edit | Code changes |
|---|---|---|
| A re-deployed project gets a URL (Q11) | `projects.ts`: `linkStatus: 'live'`, `url: 'https://…'` | None |
| A project gains a description or stack (Q8) | `projects.ts`: add the optional fields | None |
| New CV | Replace the file in `public/`; update `cv.path`, `sizeLabel`, `updated` | None |
| New project | Add an entry plus an image import; update the I-8 guard test | None |
