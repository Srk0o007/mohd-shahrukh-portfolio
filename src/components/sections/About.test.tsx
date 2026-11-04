import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { profile } from '@/content'
import { About } from './About'

describe('01 — About (FR-ABT-01)', () => {
  it('is a labelled region with the numbered eyebrow and h2', () => {
    render(<About />)
    const region = screen.getByRole('region', { name: 'Know Me More' })
    expect(region).toHaveAttribute('id', 'about')
    expect(screen.getByText('01 — About')).toBeInTheDocument()
  })

  it('shows the resume summary word for word', () => {
    render(<About />)
    expect(screen.getByText(profile.summary)).toBeInTheDocument()
  })

  it('lists the three approved key facts', () => {
    render(<About />)
    const terms = screen.getAllByRole('term').map((t) => t.textContent)
    const values = screen.getAllByRole('definition').map((d) => d.textContent)
    expect(terms).toEqual(['Role', 'Based in', 'Experience'])
    expect(values).toEqual([
      'Software Development Engineer | Frontend',
      'Bangalore, Karnataka, India',
      '6+ Years of Experience',
    ])
  })

  it('links to GitHub and LinkedIn as text links that announce the new tab', () => {
    render(<About />)
    const list = screen.getByRole('list')
    const links = within(list).getAllByRole('link')
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      'https://github.com/Srk0o007',
      'https://www.linkedin.com/in/mohd-shah-rukh-703aa3153/',
    ])
    expect(screen.getByRole('link', { name: 'LinkedIn (opens in new tab)' })).toBeInTheDocument()
  })

  it('makes no availability or targeting statement (D1, D13)', () => {
    const { container } = render(<About />)
    expect(container.textContent).not.toMatch(/Targeting|open to work|available for/i)
  })
})
