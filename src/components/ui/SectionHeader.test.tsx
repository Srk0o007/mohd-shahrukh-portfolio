import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'

describe('Section + SectionHeader (DS-02, NFR-A11Y-03)', () => {
  it('renders a labelled region with an h2 and a numbered eyebrow outside the heading', () => {
    render(
      <Section id="about" labelledBy="about-heading">
        <SectionHeader
          index="01"
          eyebrow="About"
          heading="Know Me More"
          headingId="about-heading"
        />
      </Section>,
    )
    const heading = screen.getByRole('heading', { level: 2, name: 'Know Me More' })
    expect(heading).toHaveAttribute('id', 'about-heading')
    expect(screen.getByRole('region', { name: 'Know Me More' })).toHaveAttribute('id', 'about')
    expect(screen.getByText('01 — About')).not.toBe(heading)
  })

  it('renders an optional intro', () => {
    render(
      <SectionHeader
        index="09"
        eyebrow="Contact"
        heading="Let's get in touch"
        headingId="contact-heading"
        intro={<p>Intro text</p>}
      />,
    )
    expect(screen.getByText('Intro text')).toBeInTheDocument()
  })
})
