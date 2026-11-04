import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { skillGroups } from '@/content'
import { Certifications } from './Certifications'
import { Education } from './Education'
import { Skills } from './Skills'

describe('04 — Skills (FR-RES-03, D5, Phase 11.5)', () => {
  it('is a labelled region with the numbered eyebrow', () => {
    render(<Skills />)
    expect(screen.getByRole('region', { name: 'My Skills' })).toHaveAttribute('id', 'skills')
    expect(screen.getByText('04 — Skills')).toBeInTheDocument()
  })

  it('has one tab per group in resume order, with skill counts', () => {
    render(<Skills />)
    const tabs = within(screen.getByRole('tablist', { name: 'Skill groups' })).getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(
      skillGroups.map((g, i) => `${String(i + 1).padStart(2, '0')}${g.label}${g.skills.length}`),
    )
    expect(screen.getByText('50 skills · 9 groups')).toBeInTheDocument()
  })

  it('lists every skill in a plain list per group for assistive technology', () => {
    render(<Skills />)
    for (const group of skillGroups) {
      const heading = screen.getByRole('heading', { level: 3, name: group.label, hidden: true })
      const list = heading.parentElement?.querySelector('ul') as HTMLElement
      expect(
        within(list)
          .getAllByRole('listitem', { hidden: true })
          .map((li) => li.textContent),
      ).toEqual([...group.skills])
    }
  })

  it('hides the decorative code view and the ticker from assistive technology', () => {
    const { container } = render(<Skills />)
    const pres = container.querySelectorAll('pre')
    expect(pres).toHaveLength(9)
    for (const pre of pres) expect(pre).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.ticker')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders each group as a TypeScript constant with the context as a comment', () => {
    const { container } = render(<Skills />)
    const testing = container.querySelectorAll('pre')[2]?.textContent ?? ''
    expect(testing).toContain('// unit, component, UI/API integration and end-to-end testing')
    expect(testing).toContain('export const testing = [')
    expect(testing).toContain("'React Testing Library',")
    expect(testing).toContain('] as const')
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

describe('06 — Education (FR-RES-05, owner decision 2026-11-05)', () => {
  it('shows the three entries, newest first, with institutions and years', () => {
    const { container } = render(<Education />)
    expect(screen.getByRole('region', { name: 'My Education' })).toHaveAttribute('id', 'education')
    expect(screen.getByText('06 — Education')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Bachelor in Electronics & Communication Engineering',
      'Diploma in Electronics Engineering',
      'Intermediate',
    ])
    for (const institution of [
      'Bipin Tripathi Kumaon Institute Of Technology',
      'Government Polytechnic Nainital',
      'Mahatma Gandhi Inter College',
    ]) {
      expect(screen.getByText(institution)).toBeInTheDocument()
    }
    const times = [...container.querySelectorAll('time')].map((t) => t.getAttribute('datetime'))
    expect(times).toEqual(['2016', '2019', '2012', '2015', '2010', '2012'])
  })

  it('keeps the journey line, nodes and ghost years decorative', () => {
    const { container } = render(<Education />)
    expect(container.querySelector('[data-journey]')).not.toBeNull()
    expect(container.querySelectorAll('.journey-node[aria-hidden="true"]')).toHaveLength(3)
    expect(container.querySelectorAll('.ghost-year[aria-hidden="true"]')).toHaveLength(3)
  })
})
