import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero (FR-HERO-01/02, D12, D14)', () => {
  it('has the name as the single h1 (accessible name intact across two lines)', () => {
    render(<Hero />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Mohd Shahrukh' })).toBeInTheDocument()
  })

  it('shows the eyebrow, static title and location line', () => {
    render(<Hero />)
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Software Development Engineer | Frontend')).toBeInTheDocument()
    expect(screen.getByText('Based in Bangalore, Karnataka, India.')).toBeInTheDocument()
  })

  it('links the calls to action to the projects and contact sections', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'View My Work' })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', '#contact')
  })

  it('shows the portrait with descriptive alt text and the experience caption', () => {
    const { container } = render(<Hero />)
    expect(screen.getByRole('img', { name: 'Portrait of Mohd Shahrukh' })).toBeInTheDocument()
    expect(container.querySelector('figcaption')?.textContent).toBe('6+ Years of Experience')
  })

  it('keeps the decorative stack chip and the orbits away from assistive technology', () => {
    const { container } = render(<Hero />)
    const chip = screen.getByText('React · Next.js · TypeScript')
    expect(chip.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(
      container.querySelectorAll('figure > [aria-hidden="true"]').length,
    ).toBeGreaterThanOrEqual(3)
  })

  it('marks the parallax layers with data-speed (motion module)', () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll('[data-speed]').length).toBeGreaterThanOrEqual(8)
  })

  it('is the #top target and is labelled by the h1', () => {
    render(<Hero />)
    expect(screen.getByRole('region', { name: 'Mohd Shahrukh' })).toHaveAttribute('id', 'top')
  })
})
