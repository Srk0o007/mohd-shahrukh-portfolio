import { describe, expect, it } from 'vitest'
import { projects } from '@/content'
import { imageFit, toProjectView, type ProjectViewCopy } from './project-view'

const copy: ProjectViewCopy = {
  groupLabels: { enterprise: 'Enterprise product', website: 'Website' },
  linkText: (title) => `Visit ${title} website`,
}
const views = projects.map((p, i) => toProjectView(p, i, copy))
const byId = (id: string) => {
  const view = views.find((v) => v.id === id)
  if (!view) throw new Error(id)
  return view
}

describe('toProjectView (DATA_MODEL §4)', () => {
  it('numbers projects 01–10 in content order', () => {
    expect(views.map((v) => v.index)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
    ])
  })

  it('gives only the live project a link, with descriptive text (FR-PRJ-03)', () => {
    expect(views.filter((v) => v.link).map((v) => v.id)).toEqual(['sosudatech'])
    expect(byId('sosudatech').link).toEqual({
      href: 'https://www.sosudatech.com/',
      text: 'Visit SOSUDATECH Pvt. Ltd. website',
    })
  })

  it('gives only internal products the note; pending projects get neither (FR-PRJ-04)', () => {
    expect(views.filter((v) => v.note).map((v) => v.id)).toEqual([
      'digital-asset-management',
      'approval-software-management',
      'campaign-management',
    ])
    const pending = views.filter((v) => !v.link && !v.note)
    expect(pending).toHaveLength(6)
    for (const v of pending) expect(v.meta).toBeUndefined()
  })

  it('shows verified date and stack only where they exist (FR-PRJ-05)', () => {
    expect(views.filter((v) => v.meta).map((v) => v.id)).toEqual(['sosudatech'])
    expect(byId('sosudatech').meta).toBe(
      'Nov 2020 · HTML5, CSS3, JavaScript, jQuery, Bootstrap 4.5, Photoshop',
    )
  })

  it('uses the group label for the category tag', () => {
    expect(byId('campaign-management').groupLabel).toBe('Enterprise product')
    expect(byId('niles-academy').groupLabel).toBe('Website')
  })

  it('keeps titles, subtitles and alt text verbatim from content', () => {
    projects.forEach((p, i) => {
      expect(views[i]?.title).toBe(p.title)
      expect(views[i]?.subtitle).toBe(p.subtitle)
      expect(views[i]?.image.alt).toBe(p.image.alt)
    })
  })
})

describe('imageFit (DS-08)', () => {
  it('covers wide captures and contains near-square ones', () => {
    expect(imageFit({ width: 1600, height: 900 })).toBe('cover')
    expect(imageFit({ width: 1400, height: 1000 })).toBe('cover')
    expect(imageFit({ width: 375, height: 393 })).toBe('contain')
  })
})
