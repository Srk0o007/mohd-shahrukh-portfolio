import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { experience } from '@/content'
import { Experience } from './Experience'

describe('03 — Experience (FR-RES-01, D1)', () => {
  it('is a labelled region with the numbered eyebrow', () => {
    render(<Experience />)
    expect(screen.getByRole('region', { name: 'My Experience' })).toHaveAttribute(
      'id',
      'experience',
    )
    expect(screen.getByText('03 — Experience')).toBeInTheDocument()
  })

  it('lists the three roles newest first with company notes', () => {
    render(<Experience />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'AltInvest Online Platform (formerly PropShare)',
      'BrandSystems India Pvt. Ltd.',
      'SOSUDATECH Pvt. Ltd.',
    ])
  })

  it('shows the verified date ranges in <time> elements with machine-readable values', () => {
    const { container } = render(<Experience />)
    const times = Array.from(container.querySelectorAll('time')).map((t) => [
      t.textContent,
      t.getAttribute('datetime'),
    ])
    expect(times).toEqual([
      ['May 2024', '2024-05'],
      ['Oct 2026', '2026-10'],
      ['Dec 2021', '2021-12'],
      ['Apr 2024', '2024-04'],
      ['Sep 2020', '2020-09'],
      ['Nov 2021', '2021-11'],
    ])
    expect(container.textContent).not.toMatch(/\bPresent\b/)
  })

  it('contains every highlight word for word (11 / 4 / 2)', () => {
    render(<Experience />)
    const items = screen.getAllByRole('listitem', { hidden: true })
    const all = experience.flatMap((role) => role.highlights)
    expect(all).toHaveLength(17)
    for (const highlight of all) expect(items.some((li) => li.textContent === highlight)).toBe(true)
  })

  it('offers disclosure only for the role with more than four highlights', () => {
    render(<Experience />)
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Show all 11 highlights',
    ])
  })

  it('shows the roles and taglines from the resume', () => {
    render(<Experience />)
    for (const text of [
      'Software Development Engineer',
      'Web Developer',
      'UI/UX Developer',
      "India's SEBI-regulated SM REIT investment platform",
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument()
    }
  })

  it('repeats the CV download in content with format and size (FR-RES-06)', () => {
    render(<Experience />)
    const region = screen.getByRole('region', { name: 'My Experience' })
    expect(
      within(region).getByRole('link', { name: 'Download CV (PDF, 64 KB, opens in new tab)' }),
    ).toHaveAttribute('href', '/Mohd_Shahrukh_Resume_05_Nov_2026.pdf')
  })
})
