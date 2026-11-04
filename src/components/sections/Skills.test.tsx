import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { skillGroups } from '@/content'
import { Certifications } from './Certifications'
import { Education } from './Education'
import { Skills } from './Skills'

describe('04 — Skills (FR-RES-03, D5)', () => {
  it('is a labelled region with the numbered eyebrow', () => {
    render(<Skills />)
    expect(screen.getByRole('region', { name: 'My Skills' })).toHaveAttribute('id', 'skills')
    expect(screen.getByText('04 — Skills')).toBeInTheDocument()
  })

  it('shows the nine groups in resume order as h3 labels', () => {
    render(<Skills />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      skillGroups.map((g) => g.label),
    )
  })

  it('lists every skill as a list item, with separators hidden from assistive technology', () => {
    const { container } = render(<Skills />)
    for (const group of skillGroups) {
      const groupItem = screen.getByRole('heading', { level: 3, name: group.label }).closest('li')
      if (!groupItem) throw new Error(`No list item for ${group.label}`)
      const skills = within(groupItem.querySelector('ul') as HTMLElement).getAllByRole('listitem')
      expect(skills.map((s) => s.textContent?.replace(' · ', ''))).toEqual([...group.skills])
    }
    for (const sep of container.querySelectorAll('span[aria-hidden="true"]')) {
      expect(sep.textContent).toBe(' · ')
    }
  })

  it('shows the verified context lines and no percentages', () => {
    const { container } = render(<Skills />)
    expect(
      screen.getByText('unit, component, UI/API integration and end-to-end testing'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('feature development, test-case writing, PR and code reviews'),
    ).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/\d+%/)
  })
})

describe('05 — Certifications (FR-RES-04, D3)', () => {
  it('lists the three approved certifications with issuers', () => {
    render(<Certifications />)
    expect(screen.getByRole('region', { name: 'Certifications' })).toHaveAttribute(
      'id',
      'certifications',
    )
    expect(screen.getByText('05 — Certifications')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'IBM Full Stack Software Developer',
      'JavaScript: The Complete Guide',
      'React — The Complete Guide (incl. Next.js, Redux)',
    ])
    expect(screen.getByText('IBM / Coursera')).toBeInTheDocument()
    expect(screen.getByText('Professional Certificate')).toBeInTheDocument()
    expect(screen.getAllByText('Udemy')).toHaveLength(2)
  })

  it('does not show the dropped SCSS/SASS course or any invented dates or links', () => {
    const { container } = render(<Certifications />)
    expect(container.textContent).not.toMatch(/SCSS/)
    expect(container.querySelector('a')).toBeNull()
    expect(container.textContent).not.toMatch(/\b(19|20)\d{2}\b/)
  })
})

describe('06 — Education (FR-RES-05, D2)', () => {
  it('shows the B.Tech only, with institution and graduation year', () => {
    const { container } = render(<Education />)
    expect(screen.getByRole('region', { name: 'My Education' })).toHaveAttribute('id', 'education')
    expect(screen.getByText('06 — Education')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'B.Tech, Electronics & Communication Engineering',
    ])
    expect(
      screen.getByText('Bipin Tripathi Kumaon Institute of Technology, Dwarahat'),
    ).toBeInTheDocument()
    expect(screen.getByText('Graduated 2019')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/Diploma|Intermediate/)
  })
})
