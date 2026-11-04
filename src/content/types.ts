/**
 * Content types — docs/architecture/DATA_MODEL.md (from CONTENT_SCHEMA.md).
 * Optional fields are omitted when no verified value exists; nothing is invented to fill them.
 */
import type { StaticImageData } from 'next/image'

export type Month =
  '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'
export type YearMonth = `${number}-${Month}`
export type HttpsUrl = `https://${string}`
export type MailtoUrl = `mailto:${string}`
export type TelUrl = `tel:+${string}`
export type Anchor = `#${string}`
export type SitePath = `/${string}`

/** Text that may contain **bold** emphasis only. */
export type RichText = string

export interface ImageAsset {
  src: StaticImageData
  /** '' only when decorative. */
  alt: string
  /** Enterprise screenshots supplied already blurred (DS-09). */
  blurred?: true
}

export interface SiteMeta {
  title: string
  description: string
  canonicalUrl: HttpsUrl
  locale: 'en'
}

export interface NavItem {
  label: string
  href: Anchor
}

export type SectionId =
  | 'about'
  | 'services'
  | 'experience'
  | 'skills'
  | 'certifications'
  | 'education'
  | 'projects'
  | 'testimonials'
  | 'contact'

export interface SectionHeading {
  id: SectionId
  /** '01' … '09' in page order (DS-02). */
  index: string
  /** Matches the nav label where the section is in the nav (D15). */
  eyebrow: string
  heading: string
}

export interface CvDocument {
  path: SitePath
  label: 'Download CV'
  format: 'PDF'
  sizeLabel: string
  updated: YearMonth
}

export interface Profile {
  name: string
  title: string
  location: string
  heroLocationLine: string
  summary: string
  yearsOfExperience: '6+'
  portrait: ImageAsset
}

export type ServiceIcon = 'monitor' | 'pen-ruler' | 'accessibility' | 'flask'

export interface Service {
  title: string
  description: string
  icon: ServiceIcon
}

export type ExperienceId = 'altinvest' | 'brandsystems' | 'sosudatech'

export interface Experience {
  id: ExperienceId
  company: string
  companyNote?: string
  role: string
  location: string
  start: YearMonth
  /** No "Present" (D1). */
  end: YearMonth
  tagline?: string
  highlights: readonly [RichText, ...RichText[]]
}

export interface SkillGroup {
  label: string
  skills: readonly string[]
  context?: string
}

export interface Certification {
  name: string
  issuer: string
  credentialType?: string
  issued?: YearMonth
  credentialUrl?: HttpsUrl
}

export interface Education {
  degree: string
  institution: string
  graduated: number
}

export type ProjectGroup = 'enterprise' | 'website'

interface ProjectBase {
  id: string
  title: string
  subtitle: string
  group: ProjectGroup
  image: ImageAsset
  description?: string
  date?: string
  stack?: readonly string[]
  role?: string
  relatedExperienceId?: ExperienceId
}

/** A URL exists if and only if the project is live (FR-PRJ-03/04, invariant I-2). */
export type Project =
  | (ProjectBase & { linkStatus: 'live'; url: HttpsUrl })
  | (ProjectBase & { linkStatus: 'pending' })
  | (ProjectBase & { linkStatus: 'none'; note: string })

export interface Testimonial {
  quote: string
  name: string
  role: string
  photo: ImageAsset
}

export type SocialLinkId = 'linkedin' | 'github' | 'email'

export interface SocialLink {
  id: SocialLinkId
  /** Accessible name. */
  label: string
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

export interface Footer {
  /** '{year}' is replaced at build time. */
  copyrightTemplate: string
  credit: string
}

/** New functional interface copy — CONTENT_SCHEMA §13. Placeholders use `{name}`. */
export interface UiCopy {
  skipLink: string
  menuOpen: string
  menuClose: string
  themeToDark: string
  themeToLight: string
  cvAccessibleSuffix: string
  newTab: string
  filterAll: string
  filterEnterprise: string
  filterWebsites: string
  filterStatus: string
  projectLink: string
  projectInternalNote: string
  required: string
  errName: string
  errEmail: string
  errMessage: string
  errTooLong: string
  sending: string
  sendSuccess: string
  sendError: string
  backToTop: string
  highlightsMore: string
  highlightsLess: string
  marqueePause: string
  marqueePlay: string
  notFoundHeading: string
  notFoundText: string
  notFoundLink: string
  errorHeading: string
  errorText: string
  errorRetry: string
  statLabel: string
  heroEyebrow: string
  factRole: string
  factLocation: string
  factExperience: string
  primaryNavLabel: string
  graduated: string
  tagEnterprise: string
  tagWebsite: string
}
