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

describe('08 — Testimonials (FR-TST-01, ADR 0016)', () => {
  it('is a labelled region with the numbered eyebrow', () => {
    render(<Testimonials />)
    expect(screen.getByRole('region', { name: 'What My Colleagues Say' })).toHaveAttribute(
      'id',
      'testimonials',
    )
    expect(screen.getByText('08 — Testimonials')).toBeInTheDocument()
  })

  it('shows both endorsements as figures with verbatim quotes, names, roles and photos', () => {
    render(<Testimonials />)
    // The inactive slide is aria-hidden, so query hidden content too.
    const figures = screen.getAllByRole('figure', { hidden: true })
    expect(figures).toHaveLength(2)
    testimonials.forEach((t, i) => {
      const figure = figures[i] as HTMLElement
      expect(figure.querySelector('blockquote')?.textContent).toBe(t.quote)
      const caption = figure.querySelector('figcaption') as HTMLElement
      expect(within(caption).getByText(t.name)).toBeInTheDocument()
      expect(within(caption).getByText(t.role)).toBeInTheDocument()
      expect(within(caption).getByRole('img', { hidden: true })).toHaveAttribute(
        'alt',
        `Photo of ${t.name}`,
      )
    })
  })

  it('is an ARIA carousel of labelled slides with previous, next and dot controls', () => {
    render(<Testimonials />)
    const carousel = screen.getByRole('region', { name: 'Testimonials' })
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
    const slides = within(carousel).getAllByRole('group', { hidden: true })
    expect(slides.map((s) => s.getAttribute('aria-label'))).toEqual(['1 of 2', '2 of 2'])
    for (const slide of slides) expect(slide).toHaveAttribute('aria-roledescription', 'slide')
    expect(screen.getByRole('button', { name: 'Previous testimonial' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next testimonial' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show testimonial 1' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })
})
