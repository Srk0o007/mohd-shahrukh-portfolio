/**
 * Content invariants I-1 … I-11 (DATA_MODEL.md §5) plus owner-decision guards (D1–D21).
 * These run in CI before the build so that nothing unverified or accidentally lost ships.
 */
import { describe, expect, it } from 'vitest'
import { yearMonthKey } from '@/lib/dates'
import * as content from './index'
import {
  certifications,
  contactDetails,
  education,
  experience,
  navItems,
  profile,
  projects,
  sectionHeadings,
  services,
  siteMeta,
  skillGroups,
  socialLinks,
  testimonials,
} from './index'

/** Collects every string value (with its path) from the content modules. */
function strings(value: unknown, path = 'content'): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`))
  }
  return []
}

const contentStrings = strings({
  certifications,
  contactDetails,
  education,
  experience,
  navItems,
  profile: { ...profile, portrait: { alt: profile.portrait.alt } },
  projects: projects.map((p) => ({ ...p, image: { alt: p.image.alt } })),
  sectionHeadings,
  services,
  siteMeta,
  skillGroups,
  socialLinks,
  testimonials: testimonials.map((t) => ({ ...t, photo: { alt: t.photo.alt } })),
  footer: content.footer,
  ctaBand: content.ctaBand,
  uiCopy: content.uiCopy,
  cv: content.cv,
})

describe('I-1 required fields are non-empty', () => {
  it('has no empty or whitespace-only strings', () => {
    const empty = contentStrings.filter(([, v]) => v.trim() === '')
    expect(empty).toEqual([])
  })
})

describe('I-2 / I-3 project link status', () => {
  it('has a URL if and only if the project is live, and a note when there is no public link', () => {
    for (const project of projects) {
      const hasUrl = 'url' in project
      expect(hasUrl, project.id).toBe(project.linkStatus === 'live')
      if (project.linkStatus === 'none') expect(project.note.length, project.id).toBeGreaterThan(0)
    }
  })

  it('preserves the approved link statuses (D6, D11)', () => {
    const byStatus = (status: string) =>
      projects.filter((p) => p.linkStatus === status).map((p) => p.id)
    expect(byStatus('live')).toEqual(['sosudatech'])
    expect(byStatus('none')).toEqual([
      'digital-asset-management',
      'approval-software-management',
      'campaign-management',
    ])
    expect(byStatus('pending')).toHaveLength(6)
  })
})

describe('I-4 experience order', () => {
  it('is sorted newest first with start ≤ end', () => {
    for (const role of experience) {
      expect(yearMonthKey(role.start), role.id).toBeLessThanOrEqual(yearMonthKey(role.end))
    }
    const starts = experience.map((role) => yearMonthKey(role.start))
    expect([...starts].sort((a, b) => b - a)).toEqual(starts)
  })

  it('matches the verified employment dates (D1, resume of 03 Nov 2026)', () => {
    expect(experience.map((r) => [r.id, r.start, r.end])).toEqual([
      ['altinvest', '2024-05', '2026-10'],
      ['brandsystems', '2021-12', '2024-04'],
      ['sosudatech', '2020-09', '2021-11'],
    ])
    expect(experience.map((r) => r.highlights.length)).toEqual([11, 4, 2])
  })
})

describe('I-5 unique ids', () => {
  it.each([
    ['projects', projects.map((p) => p.id)],
    ['experience', experience.map((r) => r.id)],
    ['socialLinks', socialLinks.map((s) => s.id)],
    ['sectionHeadings', sectionHeadings.map((s) => s.id)],
  ])('%s ids are unique', (_name, ids) => {
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('I-6 URLs', () => {
  it('uses https for all web links', () => {
    for (const link of socialLinks) expect(link.href).toMatch(/^(https:\/\/|mailto:)/)
    for (const project of projects) {
      if (project.linkStatus === 'live') expect(project.url).toMatch(/^https:\/\//)
    }
    expect(siteMeta.canonicalUrl).toBe('https://mohdshahrukh.in/')
  })
})

describe('I-7 metadata lengths', () => {
  it('keeps the title ≤ 70 and the description ≤ 160 characters', () => {
    expect(siteMeta.title.length).toBeLessThanOrEqual(70)
    expect(siteMeta.description.length).toBeLessThanOrEqual(160)
  })
})

describe('I-8 exactly ten projects (D6, D10, D16)', () => {
  it('keeps all ten projects in live-site order with approved groups', () => {
    expect(projects.map((p) => [p.id, p.group])).toEqual([
      ['digital-asset-management', 'enterprise'],
      ['approval-software-management', 'enterprise'],
      ['campaign-management', 'enterprise'],
      ['job-listing-website', 'website'],
      ['sosudatech', 'website'],
      ['virtual-university', 'website'],
      ['quickcashtx', 'website'],
      ['niles-academy', 'website'],
      ['swiss-cosmetics', 'website'],
      ['frontier-mining-solutions', 'website'],
    ])
  })

  it('keeps the live-site title for project #1 (D16)', () => {
    expect(projects[0]).toMatchObject({
      title: 'Digital Asset Management',
      subtitle: 'Marketing Resource Management (MRM)',
    })
  })
})

describe('I-9 owner decisions are respected', () => {
  const all = contentStrings.map(([, v]) => v).join('\n')

  it('has no "Present" employment (D1) and no targeting statement (D13)', () => {
    expect(all).not.toMatch(/\bPresent\b/)
    expect(all).not.toMatch(/Targeting SDE-2/)
  })

  it('has no Twitter/X link and no second phone number (D4)', () => {
    // The 05 Nov 2026 resume's LinkedIn slug (`mohdshahrukh156`) is allowed; a bare handle is not.
    expect(all).not.toMatch(/twitter\.com|x\.com|(?<!linkedin\.com\/in\/mohd)shahrukh156\b(?!@)/i)
    expect(all).not.toContain('9458156004')
  })

  it('has three education entries (owner decision 2026-11-05), three certifications (D3), grouped skills (D5)', () => {
    expect(education.map((e) => [e.degree, e.from, e.to])).toEqual([
      ['Bachelor in Electronics & Communication Engineering', 2016, 2019],
      ['Diploma in Electronics Engineering', 2012, 2015],
      ['Intermediate', 2010, 2012],
    ])
    for (const entry of education) expect(entry.from).toBeLessThan(entry.to)
    expect(certifications.map((c) => c.name)).toEqual([
      'IBM Full Stack Software Developer',
      'JavaScript: The Complete Guide',
      'React — The Complete Guide (incl. Next.js, Redux)',
    ])
    expect(skillGroups).toHaveLength(10)
    expect(all).not.toMatch(/\d+%/)
  })

  it('uses the static title (D12), Bangalore spelling (D14) and 6+ years', () => {
    expect(profile.title).toBe('Software Development Engineer | Frontend')
    expect(all).not.toMatch(/Bengaluru/)
    expect(profile.yearsOfExperience).toBe('6+')
    expect(all).not.toMatch(/UI\/UX Designer/)
  })
})

describe('I-10 section indices', () => {
  it('runs 01 … 09 in page order (DS-02)', () => {
    expect(sectionHeadings.map((s) => s.index)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
    ])
  })
})

describe('I-11 image alt text', () => {
  it('gives every content image a non-empty alt', () => {
    const alts = [
      profile.portrait.alt,
      ...projects.map((p) => p.image.alt),
      ...testimonials.map((t) => t.photo.alt),
    ]
    for (const alt of alts) expect(alt.trim().length).toBeGreaterThan(0)
  })
})
