import { afterEach, describe, expect, it, vi } from 'vitest'
import { currentSectionId, goToSection, legacyTarget } from './section-nav'

describe('legacyTarget (FR-NAV-06)', () => {
  it('maps the old site anchors to the new sections', () => {
    expect(legacyTarget('#home')).toBe('top')
    expect(legacyTarget('#resume')).toBe('experience')
    expect(legacyTarget('#portfolio')).toBe('projects')
    expect(legacyTarget('#testimonial')).toBe('testimonials')
  })

  it('leaves current anchors alone', () => {
    expect(legacyTarget('#projects')).toBeNull()
    expect(legacyTarget('')).toBeNull()
  })
})

describe('currentSectionId (FR-NAV-04)', () => {
  const sections = [
    { id: 'top', top: -900 },
    { id: 'about', top: -100 },
    { id: 'services', top: 300 },
    { id: 'experience', top: 1200 },
  ]

  it('is the last section whose top passed 40% of the viewport', () => {
    expect(currentSectionId(sections, { height: 1000, atBottom: false })).toBe('services')
    expect(currentSectionId(sections, { height: 500, atBottom: false })).toBe('about')
  })

  it('is the last section at the bottom of the page', () => {
    expect(currentSectionId(sections, { height: 500, atBottom: true })).toBe('experience')
  })

  it('is null before any section is reached or with no sections', () => {
    expect(currentSectionId([{ id: 'a', top: 900 }], { height: 1000, atBottom: false })).toBeNull()
    expect(currentSectionId([], { height: 1000, atBottom: true })).toBeNull()
  })
})

describe('goToSection', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    window.history.replaceState(null, '', '/')
  })

  it('focuses the section, scrolls to it and pushes the hash', () => {
    document.body.innerHTML = '<section id="skills" tabindex="-1"></section>'
    const section = document.getElementById('skills') as HTMLElement
    section.scrollIntoView = vi.fn()
    const push = vi.spyOn(window.history, 'pushState')
    expect(goToSection('skills')).toBe(true)
    expect(section.scrollIntoView).toHaveBeenCalledWith({ block: 'start' })
    expect(section).toHaveFocus()
    expect(push).toHaveBeenCalledWith(null, '', '#skills')
    expect(window.location.hash).toBe('#skills')
  })

  it('replaces the history entry when asked (legacy redirects)', () => {
    document.body.innerHTML = '<section id="projects" tabindex="-1"></section>'
    ;(document.getElementById('projects') as HTMLElement).scrollIntoView = vi.fn()
    const replace = vi.spyOn(window.history, 'replaceState')
    goToSection('projects', { replace: true })
    expect(replace).toHaveBeenCalledWith(null, '', '#projects')
  })

  it('returns false when the section is missing', () => {
    expect(goToSection('nowhere')).toBe(false)
  })
})
