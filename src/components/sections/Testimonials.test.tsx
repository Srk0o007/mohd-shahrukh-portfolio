import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { testimonials } from '@/content'
import { HireCta } from './HireCta'
import { Testimonials } from './Testimonials'

describe('Hire CTA band (FR-CTA-01, DS-10)', () => {
  it('has the heading, a tel: Call Me! link and a Hire Me! link to #contact', () => {
    render(<HireCta />)
    expect(
      screen.getByRole('region', { name: 'Interested in working with me?' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Call Me!' })).toHaveAttribute(
      'href',
      'tel:+919760787661',
    )
    expect(screen.getByRole('link', { name: 'Hire Me!' })).toHaveAttribute('href', '#contact')
  })
})

describe('08 — Testimonials (FR-TST-01)', () => {
  it('is a labelled region with the numbered eyebrow', () => {
    render(<Testimonials />)
    expect(screen.getByRole('region', { name: 'What My Colleagues Say' })).toHaveAttribute(
      'id',
      'testimonials',
    )
    expect(screen.getByText('08 — Testimonials')).toBeInTheDocument()
  })

  it('shows both endorsements as figures with verbatim quotes, names, roles and photos', () => {
    const { container } = render(<Testimonials />)
    const figures = screen.getAllByRole('figure')
    expect(figures).toHaveLength(2)
    testimonials.forEach((t, i) => {
      const figure = figures[i] as HTMLElement
      expect(figure.querySelector('blockquote')?.textContent).toBe(t.quote)
      const caption = figure.querySelector('figcaption') as HTMLElement
      expect(within(caption).getByText(t.name)).toBeInTheDocument()
      expect(within(caption).getByText(t.role)).toBeInTheDocument()
      expect(within(caption).getByRole('img')).toHaveAttribute('alt', `Photo of ${t.name}`)
    })
    // Decorative quote marks are hidden; no carousel controls (A2).
    for (const mark of container.querySelectorAll('[aria-hidden="true"]')) {
      expect(mark.textContent).toBe('“')
    }
    expect(screen.queryByRole('button')).toBeNull()
  })
})
